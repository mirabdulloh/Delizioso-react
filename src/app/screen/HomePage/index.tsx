import PopularMenu from "./PopularMenu";
import ReserveTable from "./ReserveTable";
import WelcomePage from "./WelcomePage";

function HomePage() {
  return (
    <>
      <WelcomePage />
      <PopularMenu />
      <ReserveTable />
    </>
  );
}

export default HomePage;
