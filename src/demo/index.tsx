import styles from './index.module.less';
import { Button } from 'antd';
const Demo = () => {
    return (
        <div className={styles.demo}>
            <h2>Demo Component</h2>
            <p>This is a demo component to showcase Rsbuild with React.</p>
            <Button type="primary">Click Me!</Button>
        </div>
    )
}

export default Demo