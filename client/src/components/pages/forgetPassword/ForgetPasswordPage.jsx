import { useNavigate } from "react-router-dom";
import ForgetPasswordForm from "./ForgetPasswordForm";

export default function ForgetPasswordPage() {
  const navigate = useNavigate();
  return <ForgetPasswordForm onSuccess={() => navigate("/signin")} />;
}
