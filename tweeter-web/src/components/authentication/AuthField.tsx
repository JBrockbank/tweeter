import { useState } from "react";

interface Props {
  alias: string;
  setAlias: (value: string) => void;
  password: string;
  setPassword: (value: string) => void;
  onEnterAction: (event: React.KeyboardEvent<HTMLElement>) => void;
}

const AuthField = (props: Props) => {
  const [alias, setAlias] = useState("");
  const [password, setPassword] = useState("");

  return (
    <>
      <div className="form-floating">
        <input
          type="text"
          className="form-control"
          size={50}
          id="aliasInput"
          aria-label="alias"
          placeholder="name@example.com"
          value={props.alias}
          onKeyDown={props.onEnterAction}
          onChange={(event) => props.setAlias(event.target.value)}
        />
        <label htmlFor="aliasInput">Alias</label>
      </div>
      <div className="form-floating">
        <input
          type="password"
          className="form-control"
          id="passwordInput"
          aria-label="password"
          placeholder="Password"
          value={props.password}
          onKeyDown={props.onEnterAction}
          onChange={(event) => props.setPassword(event.target.value)}
        />
        <label htmlFor="passwordInput">Password</label>
      </div>
    </>
  );
};

export default AuthField;
