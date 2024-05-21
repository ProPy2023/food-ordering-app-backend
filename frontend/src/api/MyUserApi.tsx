import { User } from "@/types";
import { useAuth0 } from "@auth0/auth0-react";
import { useMutation, useQuery } from "react-query";
import { toast } from "sonner";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

export const useGetMyUser = () => {
    const { getAccessTokenSilently } = useAuth0();
    const getMyUserRequest = async (): Promise<User> => {
        const accessToken = getAccessTokenSilently();
        const response = await fetch(`${API_BASE_URL}/api/my/user`, {
            method: "GET",
            headers: {
                Authorization: `Bearer ${accessToken}`,
                "Content-Type": "application/json",
            },
        });

        if (!response.ok) {
            throw new Error("Failed to fetch user");

        }
        console.log(response)
        return response.json();
    };
    const { data: currentUser, isLoading, error } = useQuery("fetchCurrentUser", getMyUserRequest);
    if (error) {
        toast.error(error.toString());
    }

    return { currentUser, isLoading };

};
type CreateUserRequest = {
    auth0Id: string;
    email: string;
};

export const useCreateMyUser = () => {
    const { getAccessTokenSilently } = useAuth0();

    const createMyUserRequest = async (user: CreateUserRequest) => {
        const accessToken = await getAccessTokenSilently(); // Add await here to properly get the access token
        const response = await fetch(`${API_BASE_URL}/api/my/user`, {
            method: "POST",
            headers: {
                Authorization: `Bearer ${accessToken}`,
                "Content-Type": "application/json",
            },
            body: JSON.stringify(user),
        });

        if (!response.ok) {
            throw new Error("Failed to create User");
        }
        console.log(response)

    };

    const { mutateAsync: createUser, isLoading, isSuccess, isError } = useMutation(createMyUserRequest);

    return {
        createUser,
        isLoading,
        isSuccess,
        isError,
    };
};

type UpdateMyUserRequest = {
    name: string; addressLine1: string; city: string; country: string; email?: string | undefined;
}

export const useUpdateMyUser = () => {
    const { getAccessTokenSilently } = useAuth0();

    const updateMyUserRequest = async (formData: UpdateMyUserRequest) => {
        const accessToken = getAccessTokenSilently();
        const response = await fetch(`${API_BASE_URL}/api/my/user/:id`, {
            method: "PUT",
            headers: {
                Authorization: `Bearer ${accessToken}`,
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(formData),
        });

        if (!response.ok) {
            throw new Error("Failed to Update User");

        }
        console.log(response)
        return response.json();
    };

    const { mutateAsync: updateUser, isLoading, isSuccess, error, reset } = useMutation(updateMyUserRequest);

    if (isSuccess) {
        toast.success("User profile updated!");
    }

    if (error) {
        toast.error(error.toString());
        reset();
    }
    return {
        updateUser, isLoading
    };
};