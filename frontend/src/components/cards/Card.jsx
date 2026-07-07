export default function Card({

children,

className=""

}){

return(

<div

className={`

rounded-2xl

bg-card

border

border-zinc-800

p-6

shadow-lg

transition-all

duration-300

hover:-translate-y-1

hover:border-primary

${className}

`}

>

{children}

</div>

)

}