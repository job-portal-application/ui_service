import { useAppDispatch, useAppSelector } from "@/redux/hooks";
import Info from "@/components/Info";
import { useEffect } from "react";
import { fetchUser } from "@/services/userService";
import { showLoader, hideLoader } from "@/redux/slices/loaderSlice";
import { setUser } from "@/redux/slices/userSlice";

const AccountPage = () => {
    const dispatch = useAppDispatch();
    const { user } = useAppSelector(state => state.user);
    const { isAuth } = useAppSelector(state => state.auth);
    useEffect(() => {
            const loadUser = async () => {
                dispatch(showLoader("content"));
                try {
                    const data = await fetchUser();
                    dispatch(setUser(data));
                } catch (error) {
                    throw error;
                } finally {
                    dispatch(hideLoader());
                }
            };
            loadUser();
    }, []);
    return (
        <>
        {
            isAuth && (
                <div className="w-[90%] md:w-[60%] m-auto">
                    <Info user={user} isYourAccount={true} />
                </div>
            )
        }
        </>
    )
}

export default AccountPage;