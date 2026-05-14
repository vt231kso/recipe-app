import { UserForm } from "@/components/admin/UserForm";

export default function CreateUserPage() {
  return (
    <div className="p-8 space-y-6">
      <h1 className="text-3xl font-bold font-serif">
        Додати користувача
      </h1>

      <UserForm />
    </div>
  );
}
