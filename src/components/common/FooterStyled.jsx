import styled from "styled-components";

export const FooterContainer = styled.footer`
  background-color: #e3f2fd; /* Màu xanh nhạt */
  color: #333; /* Màu chữ tối */
  padding: 2rem;
  text-align: center;
`;

export const SocialLinks = styled.div`
  margin: 1rem 0;

  a {
    margin: 0 1rem;
    color: #333;
    text-decoration: none;
    transition: color 0.3s;

    &:hover {
      color: #2196f3; /* Màu khi hover */
    }
  }
`;

export const Copyright = styled.p`
  margin-top: 1rem;
  font-size: 0.9rem;
`;
