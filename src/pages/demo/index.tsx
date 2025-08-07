import styles from './index.module.less';
import { Button, Modal } from 'antd';
const Demo = () => {
    const handleClick = () => {
       Modal.info({
            title: 'Demo Modal',
            content: (                <div>
                    <p>This is a demo modal to showcase Rsbuild with React.</p>
                </div>),
            onOk() {},
        });
    };
    return (
        <div className={styles.demo}>
            <h2>Demo Component</h2>
            <p>This is a demo component to showcase Rsbuild with React.</p>
            <Button type="primary" onClick={handleClick}>Click Me!</Button>
        </div>
    )
}

export default Demo