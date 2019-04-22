import React, { Component } from "react";
import InstagramEmbed from "react-instagram-embed";
import { TwitterTimelineEmbed } from "react-twitter-embed";
import "./Social.css";
/*global FB*/

class Social extends Component {
  render() {
    return (
      <div className="social">
        <div className="social-div">
          <InstagramEmbed
            url="https://instagr.am/p/BwKCtuhAgOQ/"
            hideCaption={false}
            containerTagName="div"
          />
        </div>
        <div className="social-div">
          <TwitterTimelineEmbed
            sourceType="profile"
            screenName="gucmun"
            options={{ height: 800, width: 500 }}
          /></div>

        <div className="social-div">
          <div id="fb-root" />
          <div
            class="fb-page"
            data-href="https://www.facebook.com/GUCMUN"
            data-tabs="timeline"
            data-width="3000"
            data-height="800"
            data-small-header="false"
            data-adapt-container-width="true"
            data-hide-cover="false"
            data-show-facepile="true"
          >
            <blockquote
              cite="https://www.facebook.com/GUCMUN"
              class="fb-xfbml-parse-ignore"
            >
              <a href="https://www.facebook.com/GUCMUN">
                German University in Cairo Model United Nations (GUCMUN)
            </a>
            </blockquote>
          </div>
        </div>
      </div>
    );
  }

  async componentDidMount() {
    window.fbAsyncInit = function () {
      FB.init({
        appId: "390253315039099",
        xfbml: true,
        version: "v2.6"
      });
      FB.XFBML.parse();
    };

    (function (d, s, id) {
      var js,
        fjs = d.getElementsByTagName(s)[0];
      if (d.getElementById(id)) {
        return;
      }
      js = d.createElement(s);
      js.id = id;
      js.src = "//connect.facebook.net/en_US/sdk.js";
      fjs.parentNode.insertBefore(js, fjs);
    })(document, "script", "facebook-jssdk");
  }
}

export default Social;
