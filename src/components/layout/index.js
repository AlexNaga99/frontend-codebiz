import React, { useEffect, useState } from "react";
import { Layout, Input, Badge, Popover, notification } from 'antd';
import { Route } from "react-router-dom";
import './style.css';
import createdBy from '../../assets/Created-by.png';
import corebizWhite from '../../assets/Vector.png';
import poweredBy from '../../assets/Powered-by.png';
import vtex from '../../assets/Vtex.png';
import logo from '../../assets/logo.png';
import { MailFilled, CustomerServiceFilled, SearchOutlined, UserOutlined, ShoppingCartOutlined, AlertOutlined, BarsOutlined } from '@ant-design/icons'; 
import { useCookies } from 'react-cookie';

const { Header, Content } = Layout;

const AppLayout = ({ component: Component, ...rest }) => {

  const [cookie, setCookie, removeCookie] = useCookies(['cart']);
  const [cart, setCart] = useState(0);

  useEffect(async () => {
    await getProductsInCart();
  }, [cookie.cart]);

  const getProductsInCart = async () => {
    if(cookie.cart){
      setCart(cookie.cart.length);
    }
    else {
      setCart(0);
    }
  }

  const clearCart = async () => {
    if(cookie.cart){
      removeCookie('cart');
    }
    else {
      openNotificationError('Seu carrinho já está vazio!');
    }
  }

  const openNotificationError = (message) => {
    notification.open({
      message: 'Algo deu errado!',
      description: message,
      icon: <AlertOutlined style={{ color: 'red' }} />,
    });
  };

  const content = (
    <div>
      <button className="newsletter-button" onClick={() => clearCart()}>Esvaziar</button>
    </div>
  );

  return (
    <Route path="/" {...rest} render={matchProps => (
      <Layout style={{ minHeight: '100vh' }}>
        <Header className="header">
          <div className="d-flex justify-content-start align-items-center container" id="result-pagination" style={{ height: '100%' }}>
            <div className="show-mobile" style={{ width: '5%' }}>
              <BarsOutlined style={{ fontSize: '150%'}}/>
            </div>
            <div className="logo-mobile" style={{ width: '25%' }}>
              <img src={logo}/>
            </div>
            <div className="hidden-mobile" style={{ width: '55%' }}>
              <Input placeholder="Oque está procurando?" suffix={<SearchOutlined />} style={{ border: 'unset', borderBottom: '1px solid #d9d9d9' }}/>
            </div>
            <div className="hidden-mobile" style={{ width: '15%' }}>
              <div className="d-flex justify-content-center">
                <div className="d-flex justify-content-center align-items-center" style={{ paddingRight: '5px' }}>
                  <UserOutlined />
                </div>
                <div className="d-flex justify-content-center" style={{ paddingLeft: '5px' }}>
                  <p style={{ margin: 'unset' }}>Minha Conta</p>
                </div>
              </div>
            </div>
            <div className="d-flex justify-content-center align-items-center" style={{ width: '5%' }}>
              <Popover content={content} title="Seu carrinho">
                <Badge count={cart}>
                  <ShoppingCartOutlined style={{ fontSize: '175%'}} />
                </Badge>
              </Popover>
            </div>
          </div>
          <div className="show-mobile-home d-flex justify-content-start" style={{ paddingTop: '15px' }}>
            <Input placeholder="Oque está procurando?" suffix={<SearchOutlined />} style={{ border: 'unset', borderBottom: '1px solid #d9d9d9' }}/>
          </div>
        </Header>
        <Layout>
          <Layout className="site-layout">
            <Content>
              <div className="site-layout-background" style={{ minHeight: '360px', height: '100%', background: 'white' }}>
                <Component/>
              </div>
            </Content>
            <footer style={{ background: 'black' }}>
              <div className="container d-flex justify-content-center">
                <div className="footer-partition p-2">
                  <div class="d-flex flex-column bd-highlight align-items-start" style={{ width: '100%', height: '100%' }}>
                    <div class="bd-highlight">
                      <h4 className="footer-title">Localização</h4>
                      <hr className="footer-trace"/>
                    </div>
                    <div class="bd-highlight">
                      <p className="footer-address">
                        Avenida Andrômeda, 2000. Bloco 6 e 8 <br/>
                        Alphavile SP <br/>
                        brasil@corebiz.ag <br/>
                        +55 11 3090 1039 <br/>
                      </p>
                    </div>
                  </div>
                </div>
                <div className="footer-partition p-2">
                  <div class="d-flex flex-column bd-highlight align-items-center" style={{ width: '100%', height: '100%' }}>
                    <div class="bd-highlight d-flex justify-content-center align-items-center p-2" style={{ height: '50%', width: '100%' }}>
                      <div className="footer-button d-flex justify-content-start align-items-center">
                        <MailFilled className="spacing-icon-footer"/><p className="footer-text">ENTRE EM CONTATO</p>
                      </div>
                    </div>
                    <div class="bd-highlight d-flex justify-content-center align-items-center p-2" style={{ height: '50%', width: '100%' }}>
                      <div className="footer-button d-flex justify-content-start align-items-center">
                        <CustomerServiceFilled className="spacing-icon-footer"/><p className="footer-text">FALE COM O NOSSO CONSULTOR ONLINE</p>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="footer-partition p-2">
                  <div className="d-flex justify-content-center align-items-center" style={{ height: '100%' }}>
                    <div className="d-flex flex-column footer-icons">
                      <img src={createdBy}/>
                      <img src={corebizWhite}/>
                    </div>
                    <div className="d-flex flex-column footer-icons">
                      <img src={poweredBy}/>
                      <img src={vtex}/>
                    </div>
                  </div>
                </div>
              </div>
            </footer>
          </Layout>
        </Layout>
      </Layout>
    )} />
  )
}

export default AppLayout;