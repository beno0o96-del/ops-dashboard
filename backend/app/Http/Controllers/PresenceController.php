<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Carbon\Carbon;

class PresenceController extends Controller
{
    public function heartbeat(Request $request)
    {
        $username = $request->input('username');
        $role = $request->input('role');

        if (!$username) {
            return response()->json(['error' => 'Username required'], 400);
        }

        // Update or Insert
        // We use updateOrInsert logic
        $exists = DB::table('presences')->where('username', $username)->exists();

        if ($exists) {
            DB::table('presences')
                ->where('username', $username)
                ->update([
                    'role' => $role,
                    'last_seen_at' => Carbon::now(),
                    'updated_at' => Carbon::now()
                ]);
        } else {
            DB::table('presences')->insert([
                'username' => $username,
                'role' => $role,
                'last_seen_at' => Carbon::now(),
                'created_at' => Carbon::now(),
                'updated_at' => Carbon::now()
            ]);
        }

        return response()->json(['status' => 'ok']);
    }

    public function index()
    {
        // Get users seen in last 5 minutes
        $time = Carbon::now()->subMinutes(5);

        $users = DB::table('presences')
            ->where('last_seen_at', '>=', $time)
            ->orderBy('last_seen_at', 'desc')
            ->get();

        return response()->json($users);
    }
}
