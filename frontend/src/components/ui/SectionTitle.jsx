export default function SectionTitle({

title,

subtitle,

id

}){

return(

<div className="mb-12">

<p className="text-primary uppercase tracking-[0.25em] text-sm">

{subtitle}

</p>

<h2 id={id} className="font-title text-5xl mt-3">

{title}

</h2>

</div>

)

}
