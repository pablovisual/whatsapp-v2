import { Button } from "@material-ui/core";
import Head from "next/head";
import styled from "styled-components";
import { auth, provider } from "../firebase";
function Login () {
  const signIn = () => {
    auth.signInWithPopup(provider).catch(alert);
  };
  
  return (
    <Container>
      <Head>
        <title>Login</title>
      </Head>

      <LoginContainer>
        <Logo src="http://assets.stickpng.com/images/580b57fcd9996e24bc43c543.png" />
        <Button onClick={signIn} variant="outlined">Sign in with Google</Button>
      </LoginContainer>
    </Container>
  );
}

export default Login

/**have the items inside placed into a grid
 * and align them to the center and the height of the
 * height being 100vh with whitesmoke color
 * background
 */
const Container = styled.div`
  display: grid;
  place-items: center;
  height: 100vh;
  background-color: whitesmoke;
`;

/**set the display into column view for 
 * logo and button, background color is white
 * align the iems to the center, give container
 * border radius and a box shadow
 */
const LoginContainer = styled.div`
  display: flex;
  flex-direction: column;
  padding: 100px;
  align-items: center;
  background-color: white;
  border-radius: 5px;
  box-shadow: 0px 4px 14px -3px rgba(0, 0, 0, 0.75);
`;

/**give image some styling */
const Logo = styled.img`
  width: 200px;
  height: 200px;
  margin-bottom: 50px;
`;