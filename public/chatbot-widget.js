(function() {
  'use strict';

  // Configuration
  const CONFIG = {
    position: 'bottom-right',
    theme: 'light',
    primaryColor: '#103FE5',
    textColor: '#333',
    backgroundColor: '#fff',
    borderRadius: '50px',
    width: '440px',
    height: '713px',
    zIndex: 1000
  };

  // Widget state
  let isOpen = false;
  let messages = [];
  let widgetContainer = null;
  let chatContainer = null;
  let inputElement = null;

  // Create widget HTML structure
  function createWidgetHTML() {
    return `
      <div id="chatbot-widget-container" style="
        position: fixed;
        ${CONFIG.position.includes('bottom') ? 'bottom: 20px;' : 'top: 20px;'}
        ${CONFIG.position.includes('right') ? 'right: 20px;' : 'left: 20px;'}
        z-index: ${CONFIG.zIndex};
        font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
        font-size: 14px;
        line-height: 1.4;
      ">
        <!-- Chat Window -->
        <div id="chatbot-window" class="chatbot-container" style="
          width: ${CONFIG.width};
          height: ${CONFIG.height};
          background-color: ${CONFIG.backgroundColor};
          border-radius: ${CONFIG.borderRadius};
          box-shadow: 0 8px 32px rgba(0, 0, 0, 0.12);
          display: none;
          flex-direction: column;
          overflow: hidden;
        ">
          <!-- Header -->
          <div style="
            color: white;
            padding-top: 40px;
            border-radius: 50px 50px;
            display: flex;
            justify-content: center;
            align-items: center;
            position: relative;
          ">
            <svg width="168" height="30" viewBox="0 0 168 30" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M98.2207 18.2261H98.374L101.947 7.6001H109.062L104.504 20.3511C102.502 26.5417 97.9741 29.6214 91.1367 29.6216H90.9209C89.8737 29.6216 88.9183 29.5608 87.4707 29.3452C87.5631 28.3288 87.625 26.3262 87.625 25.1558C88.5488 25.3097 89.4727 25.3716 90.335 25.3716C93.7536 25.3716 96.0022 24.078 97.7578 21.1831V21.1519H92.4297L87.0088 7.6001H94.4014L98.2207 18.2261ZM49.3086 7.13818C56.793 7.13818 60.9824 10.0336 60.9824 15.2388C60.9822 20.4437 56.8236 23.4624 49.3086 23.4624H48.292C40.808 23.4623 36.6506 20.4744 36.6504 15.2388C36.6504 10.0645 40.7771 7.1383 48.292 7.13818H49.3086ZM69.9951 0.978027C69.9643 3.84243 69.78 7.01492 69.626 9.94092H69.7178C71.535 8.12374 74.2455 7.13821 77.1406 7.13818H77.2949C83.3931 7.13824 86.8739 10.064 86.874 15.269C86.874 20.4126 83.4546 23.4624 77.541 23.4624H77.418C74.338 23.4624 71.2273 22.4145 69.4717 20.8745H69.4404C69.5636 21.5829 69.687 22.2921 69.7178 23.0005H62.3564C62.6336 15.8241 62.6336 7.81563 62.3564 0.978027H69.9951ZM15.0068 7.29248C18.056 7.29249 20.0275 8.12395 21.1055 10.1567L21.1357 10.187C23.3533 8.21582 25.6944 7.29249 28.4355 7.29248H28.5283C32.7784 7.29258 35.119 9.26324 35.1191 12.9897V13.2368C35.1191 16.6247 35.0575 19.8898 35.1807 23.0005H27.6035C27.6959 21.0601 27.7578 17.3942 27.7578 15.3306V15.2388C27.7578 13.206 26.5566 12.1587 24.6162 12.1587C23.446 12.1587 22.3068 12.5282 21.3213 13.2056C21.3213 16.07 21.4129 20.2285 21.5361 23.0005H14.2363C14.2671 21.1525 14.3603 17.4254 14.3604 15.3618V15.269C14.3603 13.1441 13.3436 12.189 11.3418 12.189C10.1715 12.189 8.90836 12.5277 7.98438 13.0513C7.98438 15.8849 8.01547 20.3517 8.13867 23.0005H0.5C0.777199 17.7953 0.685249 12.6513 0.53125 7.6001H7.98438C7.95358 8.55475 7.89172 9.17066 7.76855 9.84814H7.83008C9.80119 8.15422 12.327 7.29256 14.9141 7.29248H15.0068ZM74.1221 10.9575C72.4898 10.9576 71.1958 11.3573 69.9639 12.312C69.9331 14.16 69.8715 16.9636 69.9023 18.7192C71.0727 19.366 72.4591 19.7046 73.999 19.7046C77.4486 19.7046 79.3886 18.1029 79.3887 15.4233V15.1147C79.3884 12.497 77.3867 10.9575 74.1221 10.9575ZM48.8164 11.2349C45.9828 11.2349 44.2266 12.4048 44.2266 15.2075V15.3003C44.2267 17.8565 45.7977 19.2729 48.8467 19.2729C51.8342 19.2729 53.4354 17.9489 53.4355 15.3003V15.2075C53.4355 12.5281 51.8345 11.235 48.8164 11.2349Z" fill="#103FE5" />
              <path d="M160.768 16.3516H160.695C160.672 16.3437 160.648 16.3399 160.624 16.3398C160.24 16.3398 159.947 16.4238 159.747 16.5918C159.595 16.7139 159.5 16.8804 159.464 17.0908C159.587 17.1963 159.694 17.3138 159.783 17.4443C159.999 17.7483 160.107 18.1039 160.107 18.5117C160.107 18.9197 159.999 19.2761 159.783 19.5801C159.575 19.8839 159.276 20.1201 158.884 20.2881C158.5 20.4561 158.044 20.54 157.516 20.54C157.178 20.54 156.873 20.5078 156.599 20.4473C156.447 20.4908 156.328 20.5483 156.243 20.624C156.091 20.76 156.016 20.9122 156.016 21.0801C156.016 21.28 156.087 21.4284 156.231 21.5244C156.383 21.6203 156.595 21.6679 156.867 21.668H158.668C159.276 21.668 159.748 21.8042 160.084 22.0762C160.42 22.3401 160.588 22.708 160.588 23.1797C160.588 23.5957 160.455 23.952 160.191 24.248C159.927 24.552 159.567 24.7844 159.111 24.9443C158.663 25.1043 158.147 25.1836 157.563 25.1836C156.58 25.1836 155.852 25.0315 155.38 24.7275C154.908 24.4235 154.672 24.0439 154.672 23.5879C154.672 23.2679 154.784 22.988 155.008 22.748C155.166 22.5848 155.396 22.4703 155.698 22.4033C155.54 22.3351 155.401 22.2523 155.283 22.1484C155.083 21.9564 154.983 21.6877 154.983 21.3438C154.983 20.9999 155.116 20.7077 155.38 20.4678C155.516 20.3439 155.681 20.2463 155.875 20.1758C155.775 20.119 155.681 20.0585 155.596 19.9883C155.156 19.6123 154.936 19.1197 154.936 18.5117C154.936 18.1039 155.044 17.7482 155.26 17.4443C155.476 17.1404 155.775 16.9043 156.159 16.7363C156.551 16.5683 157.004 16.4844 157.516 16.4844C158.026 16.4844 158.47 16.5634 158.846 16.7207C158.875 16.5171 158.934 16.33 159.027 16.1602C159.163 15.9042 159.356 15.7036 159.604 15.5596C159.859 15.4156 160.148 15.3438 160.468 15.3438H160.563L160.768 16.3516ZM156.544 22.7236C156.32 22.7236 156.131 22.7797 155.979 22.8916C155.827 23.0116 155.752 23.1721 155.752 23.3721C155.752 23.636 155.912 23.8441 156.231 23.9961C156.551 24.1481 156.996 24.2236 157.563 24.2236C158.003 24.2236 158.364 24.1798 158.644 24.0918C158.932 24.0118 159.143 23.9036 159.279 23.7676C159.423 23.6396 159.495 23.4959 159.495 23.3359C159.495 23.152 159.42 23.0036 159.268 22.8916C159.124 22.7797 158.859 22.7236 158.476 22.7236H156.544ZM114.22 14.5645C114.74 14.5645 115.208 14.6363 115.624 14.7803C116.048 14.9243 116.408 15.1398 116.704 15.4277C117 15.7157 117.228 16.0759 117.388 16.5078L116.176 17.0479C116.016 16.576 115.784 16.2316 115.48 16.0156C115.176 15.7916 114.78 15.6797 114.292 15.6797C113.804 15.6797 113.376 15.7963 113.008 16.0283C112.64 16.2603 112.352 16.5962 112.144 17.0361C111.944 17.476 111.844 18.0119 111.844 18.6436C111.844 19.2675 111.94 19.804 112.132 20.252C112.324 20.6919 112.6 21.0278 112.96 21.2598C113.32 21.4917 113.752 21.6084 114.256 21.6084C114.744 21.6084 115.164 21.4841 115.516 21.2363C115.876 20.9803 116.132 20.5997 116.284 20.0957L117.508 20.5039C117.348 20.9838 117.108 21.3916 116.788 21.7275C116.468 22.0555 116.092 22.3037 115.66 22.4717C115.228 22.6396 114.752 22.7236 114.232 22.7236C113.472 22.7236 112.812 22.5604 112.252 22.2324C111.692 21.9044 111.26 21.4361 110.956 20.8281C110.652 20.2201 110.5 19.4916 110.5 18.6436C110.5 17.7958 110.652 17.0678 110.956 16.46C111.26 15.852 111.692 15.3837 112.252 15.0557C112.812 14.7278 113.468 14.5645 114.22 14.5645ZM121.571 16.4844C122.155 16.4844 122.671 16.6085 123.119 16.8564C123.567 17.1044 123.915 17.4638 124.163 17.9355C124.419 18.3995 124.547 18.9565 124.547 19.6045C124.547 20.2523 124.419 20.8123 124.163 21.2842C123.915 21.748 123.567 22.1036 123.119 22.3516C122.671 22.5995 122.155 22.7236 121.571 22.7236C120.987 22.7236 120.471 22.5995 120.023 22.3516C119.575 22.1036 119.223 21.7482 118.967 21.2842C118.711 20.8123 118.583 20.2523 118.583 19.6045C118.583 18.9565 118.711 18.3995 118.967 17.9355C119.223 17.4637 119.576 17.1044 120.023 16.8564C120.471 16.6085 120.987 16.4844 121.571 16.4844ZM136.185 16.4844C136.664 16.4844 137.072 16.5562 137.408 16.7002C137.752 16.8362 138.04 17.0321 138.272 17.2881C138.504 17.544 138.68 17.8362 138.8 18.1641L137.588 18.6436C137.484 18.2758 137.316 17.9956 137.084 17.8037C136.86 17.6039 136.564 17.5039 136.196 17.5039C135.836 17.5039 135.528 17.588 135.272 17.7559C135.017 17.9158 134.821 18.152 134.685 18.4639C134.557 18.7759 134.492 19.1602 134.492 19.6162C134.492 20.0641 134.56 20.4439 134.696 20.7559C134.832 21.0678 135.028 21.3039 135.284 21.4639C135.54 21.6239 135.844 21.7041 136.196 21.7041C136.468 21.7041 136.704 21.6602 136.904 21.5723C137.104 21.4763 137.268 21.3438 137.396 21.1758C137.532 20.9999 137.624 20.7879 137.672 20.54L138.836 20.9355C138.724 21.2954 138.548 21.6119 138.309 21.8838C138.077 22.1477 137.784 22.3558 137.433 22.5078C137.081 22.6518 136.676 22.7236 136.22 22.7236C135.628 22.7236 135.104 22.5995 134.648 22.3516C134.192 22.1036 133.836 21.7481 133.58 21.2842C133.332 20.8123 133.208 20.2523 133.208 19.6045C133.208 18.9565 133.332 18.3995 133.58 17.9355C133.836 17.4639 134.188 17.1044 134.636 16.8564C135.092 16.6084 135.609 16.4844 136.185 16.4844ZM146.191 16.4844C146.775 16.4844 147.272 16.6038 147.68 16.8438C148.088 17.0837 148.399 17.4122 148.615 17.8281C148.831 18.2441 148.939 18.7162 148.939 19.2441C148.939 19.3881 148.936 19.5244 148.928 19.6523C148.92 19.7802 148.908 19.8924 148.892 19.9883H144.494C144.524 20.2784 144.589 20.5343 144.691 20.7559C144.835 21.0679 145.04 21.3039 145.304 21.4639C145.568 21.6238 145.879 21.7041 146.239 21.7041C146.639 21.7041 146.963 21.6275 147.211 21.4756C147.459 21.3236 147.656 21.1118 147.8 20.8398L148.819 21.3203C148.675 21.6082 148.479 21.8602 148.231 22.0762C147.991 22.2842 147.703 22.4437 147.367 22.5557C147.031 22.6676 146.664 22.7236 146.264 22.7236C145.664 22.7236 145.136 22.5995 144.68 22.3516C144.224 22.1036 143.867 21.7481 143.611 21.2842C143.363 20.8123 143.239 20.2523 143.239 19.6045C143.239 18.9565 143.363 18.3995 143.611 17.9355C143.867 17.4639 144.219 17.1044 144.667 16.8564C145.115 16.6084 145.623 16.4844 146.191 16.4844ZM164.332 16.4844C164.916 16.4844 165.412 16.6038 165.82 16.8438C166.228 17.0837 166.54 17.4122 166.756 17.8281C166.972 18.2441 167.08 18.7162 167.08 19.2441C167.08 19.3881 167.076 19.5244 167.068 19.6523C167.06 19.7802 167.048 19.8924 167.032 19.9883H162.635C162.664 20.2784 162.73 20.5343 162.832 20.7559C162.976 21.0679 163.18 21.3039 163.444 21.4639C163.708 21.6238 164.02 21.7041 164.38 21.7041C164.78 21.7041 165.104 21.6275 165.352 21.4756C165.6 21.3236 165.796 21.1118 165.94 20.8398L166.96 21.3203C166.816 21.6082 166.62 21.8602 166.372 22.0762C166.132 22.2842 165.844 22.4437 165.508 22.5557C165.172 22.6676 164.804 22.7236 164.404 22.7236C163.804 22.7236 163.276 22.5995 162.82 22.3516C162.364 22.1036 162.008 21.7481 161.752 21.2842C161.504 20.8123 161.38 20.2523 161.38 19.6045C161.38 18.9565 161.504 18.3995 161.752 17.9355C162.008 17.4639 162.36 17.1044 162.808 16.8564C163.256 16.6084 163.764 16.4844 164.332 16.4844ZM129.391 16.4844C129.815 16.4844 130.194 16.5684 130.53 16.7363C130.874 16.8963 131.147 17.1398 131.347 17.4678C131.547 17.7957 131.646 18.2119 131.646 18.7158V22.6045H130.362V19.1123C130.362 18.5203 130.238 18.1117 129.99 17.8877C129.75 17.6559 129.446 17.54 129.078 17.54C128.814 17.5401 128.558 17.6045 128.311 17.7324C128.063 17.8524 127.855 18.0483 127.687 18.3203C127.527 18.5923 127.446 18.9562 127.446 19.4121V22.6045H126.162V16.6045H127.303L127.358 17.6523C127.453 17.4584 127.564 17.2878 127.698 17.1436C127.914 16.9117 128.166 16.7436 128.454 16.6396C128.75 16.5356 129.063 16.4844 129.391 16.4844ZM153.657 16.4844C153.777 16.4844 153.897 16.4956 154.017 16.5195C154.137 16.5355 154.236 16.5645 154.316 16.6045L154.137 17.7324C154.049 17.7004 153.949 17.6762 153.837 17.6602C153.733 17.6362 153.589 17.624 153.405 17.624C153.157 17.624 152.913 17.6921 152.673 17.8281C152.433 17.9561 152.233 18.1521 152.073 18.416C151.921 18.68 151.845 19.0159 151.845 19.4238V22.6045H150.561V16.6045H151.653L151.772 17.6836C151.932 17.2918 152.169 16.9959 152.48 16.7959C152.8 16.5879 153.193 16.4844 153.657 16.4844ZM141.614 22.6035H140.33V16.6035H141.614V22.6035ZM121.571 17.4922C121.211 17.4922 120.903 17.5762 120.647 17.7441C120.399 17.9041 120.207 18.1401 120.071 18.4521C119.935 18.7641 119.867 19.1485 119.867 19.6045C119.867 20.0523 119.935 20.436 120.071 20.7559C120.207 21.0679 120.399 21.3076 120.647 21.4756C120.903 21.6356 121.211 21.7158 121.571 21.7158C121.931 21.7158 122.235 21.6356 122.483 21.4756C122.731 21.3076 122.924 21.0677 123.06 20.7559C123.195 20.436 123.263 20.0522 123.263 19.6045C123.263 19.1486 123.195 18.7641 123.06 18.4521C122.924 18.1403 122.731 17.9041 122.483 17.7441C122.235 17.5762 121.931 17.4922 121.571 17.4922ZM157.516 17.3838C157.148 17.3838 156.84 17.4883 156.592 17.6963C156.352 17.8962 156.232 18.1678 156.231 18.5117C156.231 18.8557 156.352 19.1318 156.592 19.3398C156.84 19.5478 157.148 19.6523 157.516 19.6523C157.892 19.6523 158.199 19.5478 158.439 19.3398C158.687 19.1318 158.812 18.8557 158.812 18.5117C158.811 18.1679 158.687 17.8962 158.439 17.6963C158.199 17.4883 157.892 17.3838 157.516 17.3838ZM146.167 17.5039C145.823 17.504 145.523 17.5842 145.268 17.7441C145.012 17.9041 144.816 18.144 144.68 18.4639C144.61 18.6246 144.558 18.8049 144.524 19.0039H147.685C147.656 18.5531 147.522 18.2013 147.283 17.9482C147.011 17.6522 146.639 17.5039 146.167 17.5039ZM164.308 17.5039C163.964 17.504 163.664 17.5842 163.408 17.7441C163.152 17.9041 162.956 18.144 162.82 18.4639C162.75 18.6246 162.699 18.8049 162.665 19.0039H165.825C165.796 18.5531 165.663 18.2013 165.424 17.9482C165.152 17.6522 164.78 17.5039 164.308 17.5039ZM140.979 14C141.25 14 141.459 14.0681 141.603 14.2041C141.754 14.3401 141.83 14.5361 141.83 14.792C141.83 15.0478 141.754 15.2476 141.603 15.3916C141.459 15.5276 141.25 15.5957 140.979 15.5957C140.699 15.5957 140.482 15.5276 140.33 15.3916C140.186 15.2476 140.114 15.0478 140.114 14.792C140.114 14.5361 140.186 14.3401 140.33 14.2041C140.482 14.0681 140.699 14 140.979 14Z" fill="black" />
            </svg>
            <div
              id="chatbot-close"
              style="
                cursor: pointer;
                font-size: 20px;
                font-weight: bold;
                padding: 15px;
                background-color: #F1F1F1;
                border-radius: 50%;
                position: absolute;
                top: 20px;
                right: 45px;
              "
            >
              <svg width="12" height="12" viewBox="0 0 12 12" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M1.5 10.1985L10.5 1.19849M1.5 1.19849L10.5 10.1985" stroke="black" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" />
              </svg>
            </div>
          </div>
          <h3 style="
            font-family: Poppins, sans-serif;
            font-weight: 300;
            font-size: 16px;
            color: black;
            text-align: center;
            margin-top: 15px;
          ">Armenia Travel</h3>
          <div style="
            padding: 8px 38.35px;
            font-family: Poppins, sans-serif;
            font-size: 16px;
            color: #666;
            border-bottom: 1px solid #e9ecef;
            text-align: center;
          ">
            By engaging in this conversation, you agree to our 
            <span style="text-decoration: underline; cursor: pointer;">Terms and Conditions</span>
          </div>
          
          <!-- Messages Area -->
          <div id="chatbot-messages" style="
            flex: 1;
            padding: 16px 20px;
            overflow-y: auto;
            background-color: #ffffff;
            display: flex;
            flex-direction: column;
            gap: 12px;
          ">
            <div style="
              display: flex;
              justify-content: flex-start;
            ">
              <div style="
                background-color: #103FE5;
                color: white;
                padding: 12px 16px;
                border-radius: 16px 16px 16px 4px;
                max-width: 80%;
                font-size: 14px;
                line-height: 1.4;
                word-wrap: break-word;
              ">
                Hi! How can I help you today?
              </div>
            </div>
          </div>
          
          <!-- Input Area -->
          <div style="
            padding: 16px 20px;
            background-color: #ffffff;
            border-top: 1px solid #e9ecef;
            border-radius: 0 0 16px 16px;
          ">
            <div style="display: flex; align-items: center; gap: 8px;">
              <input 
                id="chatbot-input" 
                type="text" 
                placeholder="Type your message..." 
                style="
                  flex: 1;
                  padding: 12px 16px;
                  outline: none;
                  font-size: 14px;
                  color: black;
                  border: none;
                "
              />
              <button 
                id="chatbot-send" 
                style="
                  color: white;
                  border: none;
                  border-radius: 50%;
                  width: 40px;
                  height: 40px;
                  cursor: pointer;
                  display: flex;
                  align-items: center;
                  justify-content: center;
                  font-size: 16px;
                  background-color: transparent;
                "
              >
                <svg width="19" height="19" viewBox="0 0 19 19" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M15.3174 2.75586L3.78467 7.22559L9.19239 9.28662L11.0713 14.6279L15.3174 2.75586ZM17.062 0.000488281C17.3091 0.000488281 17.5518 0.101074 17.7324 0.289062C17.9951 0.562012 18.0806 0.969727 17.9512 1.33105L11.9507 18.1084C11.813 18.4951 11.4585 18.7505 11.063 18.7505H11.0615C10.6641 18.7495 10.3096 18.4907 10.1738 18.1035L7.61329 10.8252L0.621589 8.16016C0.24903 8.01758 0.000983041 7.64941 0.00049476 7.23633C-0.000970084 6.82324 0.2461 6.45312 0.616217 6.30859L16.7319 0.0625C16.8394 0.0209961 16.9512 0.000488281 17.062 0.000488281Z" fill="black" />
                  <path d="M8.5 9.5L16 2" stroke="black" stroke-width="2" />
                </svg>
              </button>
            </div>
          </div>
        </div>
        
        <!-- Toggle Button -->
        <div id="chatbot-toggle" class="chatbot-toggle-button" style="
          position: fixed;
          bottom: 81px;
          right: 62px;
          background-color: #103FE5;
          color: white;
          border-radius: 24px;
          cursor: pointer;
          padding: 12px;
          font-size: 13px;
          font-weight: 800;
          display: flex;
          align-items: center;
          gap: 8px;
          box-shadow: 0 4px 20px rgba(16, 63, 229, 0.3);
          transition: transform 0.2s ease;
          z-index: 1000;
          position: relative;
        ">
          <span class="toggle-text">Questions?</span>
          <svg class="toggle-icon" width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" style="display: none;">
            <path d="M19.8299 3.67603L5.32794 9.29655L12.128 11.8882L14.4906 18.6047L19.8299 3.67603ZM22.0237 0.211243C22.3344 0.211243 22.6396 0.337726 22.8668 0.574115C23.1971 0.917339 23.3045 1.43003 23.1418 1.88438L15.5964 22.9813C15.4233 23.4676 14.9775 23.7887 14.4802 23.7887H14.4783C13.9785 23.7875 13.5328 23.4621 13.3621 22.9752L10.1423 13.8229L1.35047 10.4717C0.88199 10.2925 0.57008 9.8295 0.569466 9.31006C0.567624 8.79062 0.878306 8.32521 1.34372 8.14346L21.6087 0.28922C21.7438 0.237031 21.8844 0.211243 22.0237 0.211243Z" fill="white" />
            <path d="M11.256 12.1568L20.687 2.72577" stroke="white" stroke-width="3.04225" />
          </svg>
          <div class="status-dot1" style="
            width: 8px;
            height: 8px;
            background-color: #27BE5A;
            border-radius: 50%;
            position: absolute;
            top: 3px;
            left: 3px;
            display: none;
          "></div>
          <div class="status-dot2" style="
            width: 8px;
            height: 8px;
            background-color: #27BE5A;
            border-radius: 50%;
          "></div>
        </div>
      </div>
    `;
  }

  // Add message to chat
  function addMessage(text, sender = 'bot') {
    const messagesContainer = document.getElementById('chatbot-messages');
    if (!messagesContainer) return;

    const messageWrapper = document.createElement('div');
    messageWrapper.style.cssText = `
      display: flex;
      justify-content: ${sender === 'bot' ? 'flex-start' : 'flex-end'};
    `;

    const messageDiv = document.createElement('div');
    messageDiv.style.cssText = `
      background-color: ${sender === 'bot' ? '#103FE5' : '#E5E7EB'};
      color: ${sender === 'bot' ? 'white' : '#374151'};
      padding: 12px 16px;
      border-radius: ${sender === 'bot' ? '16px 16px 16px 4px' : '16px 16px 4px 16px'};
      max-width: 80%;
      font-size: 14px;
      line-height: 1.4;
      word-wrap: break-word;
    `;
    messageDiv.textContent = text;
    
    messageWrapper.appendChild(messageDiv);
    messagesContainer.appendChild(messageWrapper);
    messagesContainer.scrollTop = messagesContainer.scrollHeight;
    
    messages.push({ text, sender });
  }

  // Show typing indicator
  function showTypingIndicator() {
    const messagesContainer = document.getElementById('chatbot-messages');
    if (!messagesContainer) return;

    const typingWrapper = document.createElement('div');
    typingWrapper.id = 'typing-indicator';
    typingWrapper.style.cssText = `
      display: flex;
      justify-content: flex-start;
    `;

    const typingDiv = document.createElement('div');
    typingDiv.style.cssText = `
      background-color: #103FE5;
      color: white;
      padding: 12px 16px;
      border-radius: 16px 16px 16px 4px;
      font-size: 14px;
      display: flex;
      align-items: center;
      gap: 4px;
    `;

    const dotsContainer = document.createElement('div');
    dotsContainer.style.cssText = `
      display: flex;
      gap: 2px;
    `;

    for (let i = 0; i < 3; i++) {
      const dot = document.createElement('div');
      dot.style.cssText = `
        width: 4px;
        height: 4px;
        background-color: white;
        border-radius: 50%;
        animation: typing 1.4s infinite ease-in-out ${i * 0.2}s;
      `;
      dotsContainer.appendChild(dot);
    }

    typingDiv.appendChild(dotsContainer);
    typingWrapper.appendChild(typingDiv);
    messagesContainer.appendChild(typingWrapper);
    messagesContainer.scrollTop = messagesContainer.scrollHeight;
  }

  // Hide typing indicator
  function hideTypingIndicator() {
    const typingIndicator = document.getElementById('typing-indicator');
    if (typingIndicator) {
      typingIndicator.remove();
    }
  }

  // Handle user input
  function handleUserInput() {
    const input = document.getElementById('chatbot-input');
    if (!input || !input.value.trim()) return;

    const userMessage = input.value.trim();
    addMessage(userMessage, 'user');
    input.value = '';

    // Show typing indicator
    showTypingIndicator();

    // Simulate bot response
    setTimeout(() => {
      hideTypingIndicator();
      addMessage('Thanks for your message! How else can I assist you?', 'bot');
    }, 1500);
  }

  // Toggle chat visibility
  function toggleChat() {
    const window = document.getElementById('chatbot-window');
    const toggle = document.getElementById('chatbot-toggle');
    
    if (!window || !toggle) return;

    isOpen = !isOpen;
    
    if (isOpen) {
      window.style.display = 'flex';
      toggle.style.display = 'none';
    } else {
      window.style.display = 'none';
      toggle.style.display = 'flex';
    }
  }

  // Initialize widget
  function initWidget() {
    // Create widget HTML
    const widgetHTML = createWidgetHTML();
    
    // Insert widget into page
    const tempDiv = document.createElement('div');
    tempDiv.innerHTML = widgetHTML;
    widgetContainer = tempDiv.firstElementChild;
    document.body.appendChild(widgetContainer);

    // Add CSS animations and responsive styles
    addStyles();

    // Add event listeners
    const toggle = document.getElementById('chatbot-toggle');
    const close = document.getElementById('chatbot-close');
    const input = document.getElementById('chatbot-input');
    const send = document.getElementById('chatbot-send');

    if (toggle) toggle.addEventListener('click', toggleChat);
    if (close) close.addEventListener('click', toggleChat);
    if (send) send.addEventListener('click', handleUserInput);
    if (input) {
      input.addEventListener('keypress', function(e) {
        if (e.key === 'Enter') {
          handleUserInput();
        }
      });
    }

    // Add hover effect to toggle button
    if (toggle) {
      toggle.addEventListener('mouseenter', function() {
        this.style.transform = 'scale(1.05)';
      });
      toggle.addEventListener('mouseleave', function() {
        this.style.transform = 'scale(1)';
      });
    }
  }

  // Add CSS styles for animations and responsive design
  function addStyles() {
    const style = document.createElement('style');
    style.textContent = `
      @keyframes typing {
        0%, 60%, 100% {
          transform: translateY(0);
          opacity: 0.4;
        }
        30% {
          transform: translateY(-10px);
          opacity: 1;
        }
      }
      
      .chatbot-container {
        width: 440px;
        height: 713px;
      }
    
      .chatbot-toggle-button{
          position: relative;
          bottom: 81px;
          right: 62px;
          padding: 12px;
          font-size: 13px;
        }
      .toggle-icon {
        display: none;
      }
        .status-dot1 {
          display: none;
        }
      
      @media (max-width: 480px) {
        .chatbot-container {
          width: 100vw;
          height: 85vh;
          max-height: 100vh;
          bottom: 0;
          right: 0;
          left: 0;
          border-radius: 0;
        }

        .chatbot-toggle-button{
          position: relative;
          bottom: 92px;
          right: 30px;
          padding: 12px;
          font-size: 13px;
        }
        
        .toggle-text {
          display: none;
        }
        
        .toggle-icon {
          display: block !important;
          width: 24px;
          height: 24px;
        }
        
        .status-dot2 {
          display: none;
        }
        .status-dot1{
          display: block;
        }
      }
    `;
    document.head.appendChild(style);
  }

  // Configuration API
  window.ChatbotWidget = {
    init: function(options = {}) {
      // Merge user options with default config
      Object.assign(CONFIG, options);
      
      // Initialize widget when DOM is ready
      if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', initWidget);
      } else {
        initWidget();
      }
    },
    
    config: function(options) {
      Object.assign(CONFIG, options);
    },
    
    open: function() {
      if (!isOpen) toggleChat();
    },
    
    close: function() {
      if (isOpen) toggleChat();
    },
    
    sendMessage: function(message) {
      addMessage(message, 'user');
    }
  };

  // Auto-initialize if script has data attributes
  const script = document.currentScript;
  if (script && script.dataset.autoInit !== 'false') {
    const options = {};
    
    if (script.dataset.position) options.position = script.dataset.position;
    if (script.dataset.theme) options.theme = script.dataset.theme;
    if (script.dataset.primaryColor) options.primaryColor = script.dataset.primaryColor;
    if (script.dataset.width) options.width = script.dataset.width;
    if (script.dataset.height) options.height = script.dataset.height;
    
    window.ChatbotWidget.init(options);
  }

})();
