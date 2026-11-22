<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Requests\AssistantRequest;
use App\Services\AssistantService;

class AssistantController extends Controller
{
    public function __construct(private AssistantService $assistants)
    {
    }

    public function index()
    {
        return $this->assistants->lister();
    }

    public function show(int $id)
    {
        return $this->assistants->trouver($id);
    }

    public function store(AssistantRequest $request)
    {
        return response()->json($this->assistants->creer($request->validated()), 201);
    }

    public function update(AssistantRequest $request, int $id)
    {
        return $this->assistants->modifier($id, $request->validated());
    }

    public function destroy(int $id)
    {
        $this->assistants->supprimer($id);

        return response()->noContent();
    }
}