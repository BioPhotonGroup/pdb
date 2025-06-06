from roles import Roles

class RoleVerifier:
    role_hierarchy = {
        Roles.GUEST: [Roles.GUEST, Roles.USER, Roles.ADMIN],  # Guest can access guest, user, and admin routes
        Roles.USER: [Roles.USER, Roles.ADMIN],  # User can access user and admin routes
        Roles.ADMIN: [Roles.ADMIN]  # Admin can only access admin routes
    }

    @staticmethod
    def has_access(user_role, required_role):
        """
        Check if the user's role satisfies the required role.
        :param user_role: Role of the current user.
        :param required_role: Role required to access the route.
        :return: True if the user has access, otherwise False.
        """
        return user_role in RoleVerifier.role_hierarchy.get(required_role, [])