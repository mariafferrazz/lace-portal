import MultiUrlField from "./MultiUrlField";

export default function TextListField(props) {
  return <MultiUrlField {...props} inputType="text" placeholder={props.placeholder || "Digite a informação"} addButtonLabel={props.addButtonLabel || "Item"} />;
}
