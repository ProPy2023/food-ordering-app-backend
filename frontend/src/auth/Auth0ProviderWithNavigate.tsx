// import { useCreateMyUser } from "@/api/MyUserApi";
import { AppState, Auth0Provider } from "@auth0/auth0-react";
import { useNavigate } from "react-router-dom";




type props = {
    children: React.ReactNode;
}


const AuthOProviderWithNavigate = ({ children }: props) => {
    // const { createUser } = useCreateMyUser();
    const navigate = useNavigate();
    // const { getAccessTokenSilently } = useAuth0();
    const domain = import.meta.env.VITE_AUTH0_DOMAIN;
    const clientId = import.meta.env.VITE_AUTH0_CLIENT_ID;
    const redirectUri = window.location.origin;
    // const redirectUri = import.meta.env.VITE_AUTH0_CALLBACK_URL;
    const audience = import.meta.env.VITE_AUTH0_AUDIENCE;

    if (!domain || !clientId || !redirectUri || !audience) {
        throw new Error("unable to instialise auth")
    }

    const onRedirectCallback = async (appState ?: AppState) => {

        // const token = await getAccessTokenSilently();
        // console.log("token", token)
        navigate(appState?.returnTo || '/auth-callback')
    }
    return (
        <Auth0Provider domain={domain}
            clientId={clientId}
            authorizationParams={{
                redirect_uri: redirectUri,
                audience,
            }}
            onRedirectCallback={onRedirectCallback}
        >

            {children}
        </Auth0Provider>
    )


}


export default AuthOProviderWithNavigate

