import { useEffect, useState } from "react";
import styles from "./Checkbox.module.scss";

function Checkbox(props: {
    data?: any
    checked: boolean
    onChecked?:any
}) {
  const [check, setCheck] = useState(false);

  useEffect(() => {
    setCheck(props.checked);
  }, [props.checked]);

    const handleClick = () => {
        props.onChecked({
            data: props?.data,
            check: !check 
        })
        setCheck(!check);
    }
  return (
    <label className={styles.checkbox_container}>
      <input
        className={styles.checkbox_input}
        type="checkbox"
        checked={check}
              onClick={handleClick}
      />
      <span className={styles.checkbox_fill}></span>
    </label>
  );
}

export { Checkbox };
