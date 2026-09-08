from check_migration_names import migration_name_errors


def test_new_migrations_follow_the_naming_policy():
    assert migration_name_errors() == []
