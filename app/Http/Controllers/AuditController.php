<?php

namespace App\Http\Controllers;

use App\Models\AuditLog;
use Illuminate\Http\Request;
use Inertia\Inertia;

class AuditController extends Controller
{
    public function index(Request $request)
    {
        $logs = AuditLog::with('user')
            ->when($request->action, fn($q, $action) => $q->where('action', $action))
            ->when($request->table_name, fn($q, $table) => $q->where('table_name', $table))
            ->orderBy('created_at', 'desc')
            ->paginate(20);

        $actions = AuditLog::distinct()->pluck('action')->filter()->values()->toArray();
        $tableNames = AuditLog::distinct()->pluck('table_name')->filter()->values()->toArray();

        return Inertia::render('Audit/Index', [
            'logs' => $logs,
            'actions' => $actions,
            'tableNames' => $tableNames,
            'filters' => [
                'action' => $request->action,
                'table_name' => $request->table_name,
            ],
        ]);
    }
}
