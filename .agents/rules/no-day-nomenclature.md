# Strict Rule: No "Day" Nomenclature in Git & GitHub Artifacts

NEVER include the word "Day" or day numbers (e.g., "Day 1", "Day 20:", "day-15") in any of the following:
- GitHub Issue titles or bodies
- Git branch names
- Git commit messages
- Pull Request titles or descriptions

## Permitted Usage
Day numbers are ONLY permitted for internal roadmap tracking in local strategy files (e.g. `day_by_day_strategy.md`) and when communicating in chat.

## Examples
- ❌ **Forbidden**: `Day 21: Create Supabase Auth UI`
- ✅ **Required**: `Create Supabase Auth UI (Login and Signup screens)`

- ❌ **Forbidden**: `feature/21-auth-ui`
- ✅ **Required**: `feature/auth-ui`

- ❌ **Forbidden**: `feat(auth): day 21 build auth forms`
- ✅ **Required**: `feat(auth): build login and signup forms with validation`
