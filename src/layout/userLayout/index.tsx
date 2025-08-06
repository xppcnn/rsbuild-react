import { Outlet } from 'react-router';
import styles from './index.module.less';

const UserLayout = () => {
    return (
        <div className={styles.userLayout}>
            <nav></nav>
            <main>
                <Outlet />
            </main>
            <footer></footer>
        </div>
    )
}

export default UserLayout