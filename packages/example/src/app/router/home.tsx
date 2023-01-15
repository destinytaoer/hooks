import { FC } from 'react';
import { Link, Outlet } from 'react-router-dom';

const HomePage: FC = () => {
  return (
    <div className="flex flex-col">
      <h1>Examples</h1>
      <ul>
        <li>
          <Link to="/use-mount">use-mount</Link>
        </li>
      </ul>
      <Outlet />
    </div>
  );
};

export default HomePage;
