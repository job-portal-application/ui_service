import { useEffect } from "react";
import { useParams } from "react-router-dom";
import { useAppDispatch, useAppSelector } from "@/redux/hooks";
import { setUser } from "@/redux/slices/userSlice";
import { showLoader, hideLoader } from "@/redux/slices/loaderSlice";
import FetchUserProfile from "@/services/FetchUserProfile";
import Loader from "@/components/Loader";
import Info from "../../components/Info";

const UserAccountPage = () => {
    const dispatch = useAppDispatch();
    const user = useAppSelector((state) => state.user.user);
    const { loading } = useAppSelector((state) => state.loader);
    const { id } = useParams();

    useEffect(() => {
        const loadUser = async () => {
            dispatch(showLoader("content"));
            try {
                const data = await FetchUserProfile(id as string);
                dispatch(setUser(data));
            } catch (error) {
                throw error;
            } finally {
                dispatch(hideLoader());
            }
        };
        loadUser();
    }, [id]);

    return (
        <>
            {loading && <Loader />}
            {
                user && (
                    <div className="w-[90%] md:w-[60%] m-auto">
                        <Info user={user} isYourAccount={false} />
                    </div>
                )
            }
        </>
    );
};

export default UserAccountPage;