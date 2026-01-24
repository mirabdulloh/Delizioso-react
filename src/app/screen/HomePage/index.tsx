import BestChefs from "./BestChefs";
import CostumerReviews from "./CostumerReviews";
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
    </>
  );
}

export default HomePage;
