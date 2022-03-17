import styles from "./button.module.scss"

function Button(props: { warning: boolean, children?: any }) {
    return (
        <button className={`${styles.button} ${props?.warning === true ? styles.warning : null}`}>
            <span>
                {props?.children}
            </span>
        </button>
    )
}

export {
    Button
}