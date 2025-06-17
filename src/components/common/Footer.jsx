import React from "react";
import { FooterContainer, SocialLinks, Copyright } from "./FooterStyled";

const Footer = () => {
  return (
    <FooterContainer>
      <h3>Liên hệ với chúng tôi</h3>
      <SocialLinks>
        <a
          href="https://facebook.com"
          target="_blank"
          rel="noopener noreferrer"
        >
          Facebook
        </a>
        <a href="https://twitter.com" target="_blank" rel="noopener noreferrer">
          Twitter
        </a>
        <a
          href="https://instagram.com"
          target="_blank"
          rel="noopener noreferrer"
        >
          Instagram
        </a>
      </SocialLinks>
      <Copyright>
        &copy; {new Date().getFullYear()} Rent-House.com. Bảo lưu mọi quyền.
      </Copyright>
    </FooterContainer>
  );
};

export default Footer;
