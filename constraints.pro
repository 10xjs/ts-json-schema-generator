constraints_min_version(1).

empty('').

prefix('>').
prefix('>=').
prefix('<').
prefix('<=').
prefix('~').
prefix('^').

prefix_version(Prefix, Version, Range) :-
  prefix(Prefix), atom_concat(Prefix, Version, Range).

gen_enforced_dependency(WorkspaceCwd, DependencyName, DesiredRange, DependencyType) :-
  workspace_has_dependency(WorkspaceCwd, DependencyName, CurrentRange, DependencyType),
  prefix_version(_, DesiredRange, CurrentRange).
