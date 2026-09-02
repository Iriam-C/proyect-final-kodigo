<?php

namespace Database\Seeders;


use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

class DatabaseSeeder extends Seeder
{
   
    public function run(): void
    {
        DB::table('roles')->updateOrInsert(
            ['nombre' => 'admin'],
            [
                'created_at' => now(),
                'updated_at' => now(),
            ]
        );

        DB::table('roles')->updateOrInsert(
            ['nombre' => 'editor'],
            [
                'created_at' => now(),
                'updated_at' => now(),
            ]
        );

        DB::table('roles')->updateOrInsert(
            ['nombre' => 'usuario'],
            [
                'created_at' => now(),
                'updated_at' => now(),
            ]
        );
    }
}
