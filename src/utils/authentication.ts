import jwt from 'jsonwebtoken';
import config from '@utils/config'


export const authenticateToken = (authHeader: string | null): { valid: boolean, payload?: object, error?: string } => {
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return { valid: false, error: 'Unauthorized' };
  }

  // JWT fängt per Definition immer mit Bearer + Leerzeichen an. Daher muss das Bearer entfernt werden. 
  const token = authHeader.substring(7); // Remove 'Bearer ' from the header

  try {
    // der JWT wird entschlüsselt, geht dies schief, ist der Token nicht mehr gültig und dann wird false zurück gegeben. 
    let payload = jwt.verify(token, config.secretKey); 
    console.log("Payload in get: ", payload);
    return { valid: true, payload: payload };
  } catch (err) {
    return { valid: false, error: 'Forbidden' };
  }
}



