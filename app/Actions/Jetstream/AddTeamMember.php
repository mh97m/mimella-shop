<?php

declare(strict_types=1);

namespace App\Actions\Jetstream;

use Closure;
use App\Models\Team;
use App\Models\User;
use Laravel\Jetstream\Jetstream;
use Laravel\Jetstream\Rules\Role;
use Illuminate\Support\Facades\Gate;
use Illuminate\Contracts\Validation\Rule;
use Illuminate\Support\Facades\Validator;
use Laravel\Jetstream\Events\TeamMemberAdded;
use Laravel\Jetstream\Events\AddingTeamMember;
use Laravel\Jetstream\Contracts\AddsTeamMembers;
use Illuminate\Validation\Validator as ValidatorAlias;

final class AddTeamMember implements AddsTeamMembers
{
    /**
     * Add a new team member to the given team.
     */
    public function add(User $user, Team $team, string $mobile, ?string $role = null): void
    {
        Gate::forUser($user)->authorize('addTeamMember', $team);

        $this->validate($team, $mobile, $role);

        $newTeamMember = Jetstream::findUserByMobileOrFail($mobile);

        AddingTeamMember::dispatch($team, $newTeamMember);

        $team->users()->attach(
            $newTeamMember, ['role' => $role]
        );

        TeamMemberAdded::dispatch($team, $newTeamMember);
    }

    /**
     * Validate the add member operation.
     */
    private function validate(Team $team, string $mobile, ?string $role): void
    {
        Validator::make([
            'mobile' => $mobile,
            'role' => $role,
        ], $this->rules(), [
            'mobile.exists' => __('We were unable to find a registered user with this mobile address.'),
        ])->after(
            $this->ensureUserIsNotAlreadyOnTeam($team, $mobile)
        )->validateWithBag('addTeamMember');
    }

    /**
     * Get the validation rules for adding a team member.
     *
     * @return array<string, Rule|array<mixed>|string>
     */
    private function rules(): array
    {
        return array_filter([
            'mobile' => ['required', 'mobile', 'exists:users'],
            'role' => Jetstream::hasRoles()
                            ? ['required', 'string', new Role]
                            : null,
        ]);
    }

    /**
     * Ensure that the user is not already on the team.
     */
    private function ensureUserIsNotAlreadyOnTeam(Team $team, string $mobile): Closure
    {
        return function ($validator) use ($team, $mobile): void {
            /** @var ValidatorAlias $validator */
            $validator->errors()->addIf(
                $team->hasUserWithMobile($mobile),
                'mobile',
                __('This user already belongs to the team.')
            );
        };
    }
}
