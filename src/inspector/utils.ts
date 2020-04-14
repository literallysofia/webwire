export enum ElementType {
  Header = "header",
  Footer = "footer",
  Container = "container",
  Title = "title",
  Link = "link",
  Text = "text",
  Image = "image",
  Icon = "icon",
  TextField = "textField",
  Checkbox = "checkbox",
  Radio = "radio",
  Button = "button",
  Burguer = "burguer",
  Dropdown = "dropdown"
}

export function capitalize(s: string) {
  return s.charAt(0).toUpperCase() + s.slice(1);
}
