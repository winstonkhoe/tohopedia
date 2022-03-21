import styles from "./button.module.scss";

function Button(props: { warning: boolean; children?: any; disable: boolean }) {
  return (
    <button
      className={`${
        props?.disable === false ? styles.button : styles.disable
      } ${props?.warning === true ? styles.warning : ""}`}
    >
      <span>{props?.children}</span>
    </button>
  );
}

export { Button };
