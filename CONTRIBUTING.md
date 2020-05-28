# How To Contribute

The following is a set of guidelines for contributing to the EMo Viewer.
Feel free to propose changes whenever the workflow could be improved!

## Issue Tracker

Issues are created and assigned by the project's Product Owner during a sprint planning in the [issue tracker](https://gitlab.gwdg.de/subugoe/emo/QViewer/-/issues).
As soon as you start working on a assigned issue, switch its label to `Doing`.
This will cause the issue to be moved into the right list of the repository's [board](https://gitlab.gwdg.de/subugoe/emo/QViewer/-/boards).

## Internal Workflow

### Reporting Bugs or Change Requests

Bugs and change requests are managed by the project's Product Owner.
Please report any problems that aren't related to the bugfix/feature you're working on right now to her/him.
Bug reports can also be handed it via [mail](mailto:gitlab+subugoe-emo-qviewer-10921-issue-@gwdg.de).
She/he will create an issue in the correct repository and ask for assignees in the course of the next sprint planning.

### Git Flow

For developing in EMo we use `git flow` as a branching and development model.
This means that all development will be reviewed before they will be merged to the `develop` branch.
Please confer [Atlassian's git flow tutorial](https://www.atlassian.com/git/tutorials/comparing-workflows/gitflow-workflow) for more information on how git flow works.

Every branch should be to dedicated to an issue, i.e. there shouldn't be any branches without a corresponding ticket.
Each branch should start with the dedicated issue number and a short description on what the ticket is about, e.g. `feature/#1-contributing`.

All issues will be arranged in [milestones](https://gitlab.gwdg.de/groups/subugoe/ahiqar/-/milestones).
Milestones are always group-wide, so we combine tickets from all repositories associated with Ahiqar to a single milestone.
The milestone number is increased with each sprint in accordance to [Semantic Versioning](https://semver.org/).

### Merge Requests (MR)

Merge requests should be peer reviewed before merging them into `develop`.
A well-tried workflow is:

1. A developer decides to work on a feature.
She uses the current development branch as a base for her work.
She commits her changes to a separate feature branch.
After some time she finishes the feature and wants it to be part of the development branch.
2. Before creating her merge request, the developer rebases her branch on the basis of `develop`.
This minimizes the change of merge conflicts.
You can either use `rebase` or `merge` for this.
3. The developer creates a merge request and assigns everybody she sees fit to properly review her code to it.
She uses one of the proposed merge templates in order to not forget anything and ease her reviewers' work.
4. To avoid diffusion of responsibility, she also assigns one of the chosen assignees as MUST.
This means that this person has to approve the MR, otherwise the merge cannot be done.
Although GitLab sends notifications to everybody who is newly assigned to a MR, she should notify the MUST assignee personally (in case he or she doesn't notice the mail sent by GitLab).
The MR settings are:

    * The MR is associated with the current sprint's [milestone](https://gitlab.gwdg.de/groups/subugoe/ahiqar/-/milestones).
    * The boxes for "Squash Commit" and "Deleting branch after Merge" are ticked

5. The MUST assignee reviews the changes according to style, variable naming, understandability, documentation provided, functionality, etc.
If everything is to his or her liking, he or she approves the MR.
The other assignees are free to review the code as well.
**Note:** MRs without docs should not be accepted.
6. After the MR has been (dis)approved, the assignee removes his- or herself from the list of assignees.
The MUST assignee informs the developer over the review being done.
7. The developer merges her changes into the development branch.

If a merge conflict occurs the person who has proposed the MR is responsible for solving all conflicts.
