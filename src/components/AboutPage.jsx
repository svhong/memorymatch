import "./AboutPage.css";

export default function AboutPage() {
  return (
    <div className="about">
      <header>
        <h1>About Me!</h1>
      </header>
      <div className="myPic">
        <img src="images/seanhong.jpg" alt="picture of me" />
        <p>
          <a href="myportfolio.html">My portfolio</a>
        </p>
      </div>
      <div className="gameDescription">
        <p>
          Welcome to the memory match game! This game will test your memory
          skills. Try and match and find the same characters from the beloved
          movie series! Too easy? try and finish the game before you reach
          88mph!
        </p>
      </div>
      <div className="skillsList">
        This game was made by using:
        <ul>
          <li>HTML</li>
          <li>CSS</li>
          <li>JavaScript</li>
          <li>React</li>
        </ul>
      </div>
      <footer>
        Thank you for playing! <a href="#/">Back to the game</a>
      </footer>
    </div>
  );
}
