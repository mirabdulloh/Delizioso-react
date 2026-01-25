import BestChefs from "./BestChefs";
import CostumerReviews from "./CostumerReviews";
import OpenCloseTime from "./OpenCloseTime";
import PopularMenu from "./PopularMenu";
import ReserveTable from "./ReserveTable";
import WelcomePage from "./WelcomePage";

function HomePage() {
  return (
    <>
      <WelcomePage />
      <PopularMenu />
      <ReserveTable />
      <BestChefs />
      <CostumerReviews />
      <OpenCloseTime />
    </>
  );
}

export default HomePage;
