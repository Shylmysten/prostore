import { Metadata } from "next";
import { notFound } from "next/navigation";
import { getUserById } from "@/lib/actions/user.actions";
import UpdateUserForm from "./update-user-form";
import { requireAdmin } from "@/lib/auth-guard";

export const metadata: Metadata = {
    title: 'Update User'
}

const AdminUserUpdatePage = async (props: {
    params: Promise<{
        id: string;
    }>
}) => {
    await requireAdmin();

    const { id } = await props.params;

    const user = await getUserById(id);

    if(!user) notFound();

    return ( 
        <div className="space-y-8 max-w-lg mx-auto">
            <h1 className="h2-bold">Update User</h1>
           <UpdateUserForm user={{ ...user, role: user.role ?? "user" }} />
        </div>
     );
}
 
export default AdminUserUpdatePage;