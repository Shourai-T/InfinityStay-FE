import { useSearchParams } from "react-router-dom";
import PaymentFailed from "../Booking/PaymentFailed";
import Confirmation from "../Confirmation";

export default function PaymentCf() {
  const [searchParams] = useSearchParams();
  const status = Number(searchParams.get("status"));

  const isSuccess = status === 1;
  return <>{isSuccess ? <Confirmation /> : <PaymentFailed />}</>;
}
