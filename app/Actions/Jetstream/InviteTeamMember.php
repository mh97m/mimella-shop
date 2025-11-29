<?php

declare(strict_types=1);

namespace App\Actions\Jetstream;

use Closure;
use App\Models\Team;
use App\Models\User;
use Illuminate\Validation\Rule;
use Laravel\Jetstream\Jetstream;
use Laravel\Jetstream\Rules\Role;
use Illuminate\Support\Facades\Gate;
use Illuminate\Support\Facades\Mail;
use Illuminate\Database\Query\Builder;
use Illuminate\Support\Facades\Validator;
use Laravel\Jetstream\Mail\TeamInvitation;
use Laravel\Jetstream\Events\InvitingTeamMember;
use Laravel\Jetstream\Contracts\InvitesTeamMembers;
use App\Models\TeamInvitation as TeamInvitationModel;
use Illuminate\Validation\Validator as ValidatorAlias;

final class InviteTeamMember implements InvitesTeamMembers
{
    /**
     * Invite a new team member to the given team.
     */
    public function invite(User $user, Team $team, string $mobile, ?string $role = null): void
    {
        Gate::forUser($user)->authorize('addTeamMember', $team);

        $this->validate($team, $mobile, $role);

        InvitingTeamMember::dispatch($team, $mobile, $role);

        /** @var TeamInvitationModel $invitation */
        $invitation = $team->teamInvitations()->create([
            'mobile' => $mobile,
            'role' => $role,
        ]);

        Mail::to($mobile)->send(new TeamInvitation($invitation));
    }

    /**
     * Validate the invite member operation.
     */
    private function validate(Team $team, string $mobile, ?string $role): void
    {
        Validator::make([
            'mobile' => $mobile,
            'role' => $role,
        ], $this->rules($team), [
            'mobile.unique' => __('This user has already been invited to the team.'),
        ])->after(
            $this->ensureUserIsNotAlreadyOnTeam($team, $mobile)
        )->validateWithBag('addTeamMember');
    }

    /**
     * Get the validation rules for inviting a team member.
     *
     * @return array<string, mixed>
     */
    private function rules(Team $team): array
    {
        return array_filter([
            'mobile' => [
                'required', 'mobile',
                Rule::unique(Jetstream::teamInvitationModel())->where(function (Builder $query) use ($team): void {
                    $query->where('team_id', $team->id);
                }),
            ],
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
        return function (ValidatorAlias $validator) use ($team, $mobile): void {
            $validator->errors()->addIf(
                $team->hasUserWithMobile($mobile),
                'mobile',
                __('This user already belongs to the team.')
            );
        };
    }
}
