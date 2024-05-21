import { Order, Restaurant } from "@/types";
import { useAuth0 } from "@auth0/auth0-react";
import { useMutation, useQuery } from "react-query";
import { toast } from "sonner";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

export const useGetMyRestaurant = () => {
    // console.log("object")
    const { getAccessTokenSilently } = useAuth0();
    const getMyRestaurantRequest = async (): Promise<Restaurant> => {
        const accessToken = await getAccessTokenSilently();
        const response = await fetch(`${API_BASE_URL}/api/my/restaurant`, {
            method: "GET",
            headers: {
                Authorization: `Bearer ${accessToken}`
            }
        });
        if (!response.ok) {
            throw new Error("Failed to get Restaurant");
        }
        console.log(response)
        return response.json();
    };

    const { data: restaurant, isLoading } = useQuery("fetchMyRestaurant", getMyRestaurantRequest);

    return { restaurant, isLoading };
};



export const useCreateMyRestaurant = () => {
    const { getAccessTokenSilently } = useAuth0();
    const createMyRestaurantRequest = async (restaurantFormData: FormData) => {
        const accessToken = await getAccessTokenSilently();
        const response = await fetch(`${API_BASE_URL}/api/my/restaurant`, {
            method: "POST",
            headers: {
                Authorization: `Bearer ${accessToken}`
            },
            body: restaurantFormData,
        });
        if (!response.ok) {
            throw new Error("Failed to create restaurant");
        }
        return response.json();
    };

    const {
        mutate: createRestaurant,
        isLoading,
        isSuccess,
        error,
    } = useMutation(createMyRestaurantRequest);


    if (isSuccess) {
        toast.success("Restaurant created!");
    }

    if (error) {
        toast.error("unable to update restaurant");
    }
    return { createRestaurant, isLoading };
};


export const useUpdateMyRestaurant = () => {
    const { getAccessTokenSilently } = useAuth0();

    const UpdateRestaurantRequest = async (restaurantFormData: FormData): Promise<Restaurant> => {

        const accessToken = await getAccessTokenSilently();

        const response = await fetch(`${API_BASE_URL}/api/my/restaurant`, {
            method: "PUT",
            headers: {
                Authorization: `Bearer ${accessToken}`
            },
            body: restaurantFormData,
        });
        if (!response.ok) {
            throw new Error("Failed to create restaurant");
        }
        return response.json();
    };

    const { mutate: updateRestaurant, isLoading, isSuccess, error } = useMutation(UpdateRestaurantRequest);

    if (isSuccess) {
        toast.success("Restaurant Update");
    }

    if (error) {
        toast.error('Unable to update restaurant');
    }

    return { updateRestaurant, isLoading }
}


export const useGetMyRestaurantOrders = () => {
    const { getAccessTokenSilently } = useAuth0();

    const getMyRestaurantOrdersRequest = async (): Promise<Order[]> => {
        const accessToken = await getAccessTokenSilently();
        const response = await fetch(`${API_BASE_URL}/api/my/restaurant/order`, {
            headers: {
                Authorization: `Bearer ${accessToken}`,
                "Content-Type": "application/json",
            },
        });
        if (!response.ok) {
            throw new Error("Failed to fetch order");
        }

        return response.json();
    };


    const { data: orders, isLoading } = useQuery(
        "fetchMyRestaurantOrders",
        getMyRestaurantOrdersRequest
    );

    return { orders, isLoading };
}

type UpdateOrderStatusRequest = {
    orderId: string;
    status: string;
};

export const useUpdateMyRestaurantOrder = () => {
    const { getAccessTokenSilently } = useAuth0();

    const useUpdateMyRestaurantOrder = async (updateStatusOrderRequest: UpdateOrderStatusRequest) => {
        const accessToken = await getAccessTokenSilently();
        const response = await fetch(`${API_BASE_URL}/api/my/restaurant/order/${updateStatusOrderRequest}/status`, {
            method: "PATCH",
            headers: {
                Authorization: `Bearer ${accessToken}`,
                "Content-Type": "application/json",
            },
            body: JSON.stringify({ status: updateStatusOrderRequest.status })
        });
        if (!accessToken) {
            throw new Error("Failed to update Status");

        }
        return response.json();

    };


    const { mutateAsync: updateRestaurantStatus, isLoading, isSuccess, isError, reset } = useMutation(useUpdateMyRestaurantOrder);
    if (isSuccess) {
        toast.success("Order updated")
    }

    if (isError) {
        toast.error("Unable to update order");
        reset();
    }

    return { updateRestaurantStatus, isLoading };
}