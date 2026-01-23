import BestChefs from "./BestChefs";
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
    </>
  );
}

export default HomePage;
