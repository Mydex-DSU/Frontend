import styled from 'styled-components';
// import arrow from './images/right.png'


export const BodyContainer = styled.div`
    display: flex;
    position: relative;
    flex-direction: column;
    align-items: center;
    overflow: hidden;
`

// export const SliderContainer = styled.div`
//     margin: 200px 200px;
//     .slick-prev:before,
//     .slick-next:before {
//         display: none;	
//     }
//     .slick-list{ 
//         width: 4000px;
//     }   
// `
export const SliderContainer = styled.div`
    margin: 200px 200px;
    .slick-prev:before,
    .slick-next:before {
        color: black; // 화살표 색상 설정
    }
    .slick-list{ 
        width: 4000px;
    }   
`

export const SliderContent = styled.div`
    height: 500px;
    color: white;
    font-size: 100px;
    line-height : 500px;
    text-align : center;
    background-color: ${props => props.$color};
    width: 1000px;
    margin: auto; /* 주석을 이렇게 처리합니다 */
`