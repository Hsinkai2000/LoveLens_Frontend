import { Route, Routes } from 'react-router-dom';
import { NavigationPaths } from './NavigationPaths';
import EnterRoom from '../Mobile/EnterRoom';
import MobileMainPage from '../Mobile/MobileMainPage';
import EnterUsername from '../Mobile/EnterUsername';
import LandingPage from '../Mobile/LandingPage';

export default function MobileRoutes() {
    return (
        <Routes>
            <Route
                path={NavigationPaths.defaultPathMobile}
                element={<LandingPage />}
            ></Route>
            <Route
                path={NavigationPaths.enterRoomPath}
                element={<EnterRoom />}
            ></Route>
            <Route
                path={NavigationPaths.mobileMainPath}
                element={<MobileMainPage />}
            ></Route>
            <Route
                path={NavigationPaths.enterUsernamePath}
                element={<EnterUsername />}
            ></Route>
        </Routes>
    );
}
