export default function Button({

    children,

    variant="primary",
    as: Component = "button",
    className = "",
    ...props

}){

const variants={

primary:
"bg-primary-fill text-on-primary hover:brightness-105",

outline:
"border border-primary text-primary hover:bg-primary-fill hover:text-on-primary",

ghost:
"text-primary hover:bg-card",

dark:
"border border-border bg-card text-text hover:border-primary hover:bg-primary-fill hover:text-on-primary focus-visible:border-primary"

}

return(

<Component

className={`

rounded-xl

cursor-pointer

px-6

py-3

font-semibold

transition-all

duration-300

${variants[variant]}
${className}
`}

{...props}

>

{children}

</Component>

)

}
