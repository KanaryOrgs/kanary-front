import styled from "styled-components";

export const Header = styled.header`
    background: #1e2838;
    color: #fff;
    height: 75px;
    display: flex;
    align-items: center;
    justify-content: flex-end;
    padding-right: 20px;

    .input-nav {
        margin-left: 5rem !important;
        width: 25rem;
    }

    @media (max-width: 920px) {
        .input-nav {
            display: none;
        }
    }
`;