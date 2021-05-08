
import React, { useState, useEffect } from "react";
import 'antd/dist/antd.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'popper.js';
import 'bootstrap/dist/js/bootstrap.min.js';
import './style.css';
import banner from '../../assets/banner-completo.png';
import banner_mobile from '../../assets/mobile-thumb.png';
import { Spin, Card, Image, Rate, Input, Form, notification  } from 'antd';
import { AlertOutlined, CheckCircleOutlined } from '@ant-design/icons';
import { products_service } from '../../services/products';
import { newsletter_service } from '../../services/newsletter';
import { useCookies } from 'react-cookie';

const Home = () => {

  const { Meta } = Card;

  const [loading, setLoading] = useState(true);
  const [products, setProducts] = useState([]);
  const [cookie, setCookie] = useCookies(['cart']);

  useEffect(async () => {
    setProducts([]);
    await getProducts();
  }, [0]);

  const addProduct = async (idProduct) => {
    setLoading(true);
    if(cookie.cart){
      let list_cart = cookie.cart;
      list_cart.push(idProduct);

      let tomorrow = new Date();
      tomorrow.setDate(tomorrow.getDate()+1);
      setCookie('cart', list_cart, { path: '/', expires: tomorrow });
    }
    else {
      let list_cart = [];
      list_cart.push(idProduct);
      
      let tomorrow = new Date();
      tomorrow.setDate(tomorrow.getDate()+1);
      setCookie('cart', list_cart, { path: '/', expires: tomorrow });
    }
    setLoading(false);
    openNotificationSucess('Item adicionado ao carrinho!', 'O item pode ser visualizado através do seu carrinho!');
  }

  const submitNewsletter = async (values) => {
    setLoading(true);
    let body = {
      email: values.email,
      name: values.name
    }
    let news_response = await newsletter_service.insertNewsletter(body);
    let news = news_response.data;
    if(news && news.message){
      openNotificationSucess('Newsletter cadastrado!', 'Agora você irá participar das nossas news com promoções e novidades!');
    }
    else {
      openNotificationError('Sua solicitação deu errado, contate nossa equipe!');
    }
    setLoading(false);
  }

  const getProducts = async () => {
    let products_list = await products_service.getProducts();
    let check_products = products_list.data;
    if (check_products[0]) {
      setProducts(check_products);
    }
    else {
      openNotificationError('Ocorreu um erro ao listar os produtos!');
    }
    setLoading(false);
  }

  const listProducts = () => {
    let array = [];

    for (let index = 0; index < products.length / 4; index++) {
      if (index == 0) {
        let obj = (
          <div class="carousel-item active">
            <div className="d-flex justify-content-between">
              {
                products.map((product, i) => {
                  if (i < 4) {
                    return (
                      <Card hoverable style={{ width: 240, height: '500px' }} cover={<Image width={'100%'} src={product.imageUrl} />}>
                        <Meta title={product.productName} description={
                          <div style={{ height: '100%' }}>
                            <div className="d-flex justify-content-center" style={{ height: '15%' }}>
                              <Rate allowHalf defaultValue={product.stars} disabled={true} style={{ color: '#F8475F' }}/>
                            </div>
                            <div style={{ height: '15%' }}>
                              {product.listPrice ? <p className="list-price">de: {(product.listPrice/100).toLocaleString('pr-BR', {style: 'currency',currency: 'BRL', minimumFractionDigits: 2})}</p> : null }
                            </div>
                            <div style={{ height: '15%' }}>
                              <p className="price"><b>por {(product.price/100).toLocaleString('pr-BR', {style: 'currency',currency: 'BRL', minimumFractionDigits: 2})}</b></p>
                            </div>
                            <div style={{ height: '15%' }}>
                              {product.installments[0] ? <p className="installment">ou em {product.installments[0].quantity}x de {(product.installments[0].value/100).toLocaleString('pr-BR', {style: 'currency',currency: 'BRL', minimumFractionDigits: 2})}</p> :null}
                            </div>
                            <div style={{ height: '40%' }}>
                              <div className="d-flex justify-content-center align-self-end">
                                <button className="purchase-button" onClick={() => addProduct(product.productId)}>COMPRAR</button>
                              </div>
                            </div>
                          </div>
                        } />
                      </Card>
                    )
                  }
                  i++;
                })
              }
            </div>
          </div>)
        array.push(obj);
      }
      if (index > 0) {

        let obj = (
          <div class="carousel-item">
            <div className="d-flex justify-content-between">
              {
                products.filter((product, i) => i >= index * 4 && i < (index + 1) * 4).map(filteredProduct => {
                  return (
                    <Card hoverable style={{ width: 240, height: '500px' }} cover={<Image width={'100%'} src={filteredProduct.imageUrl} />}>
                      <Meta title={filteredProduct.productName} description={
                          <div style={{ height: '100%' }}>
                            <div className="d-flex justify-content-center" style={{ height: '15%' }}>
                              <Rate allowHalf defaultValue={filteredProduct.stars} disabled={true} style={{ color: '#F8475F' }}/>
                            </div>
                            <div style={{ height: '15%' }}>
                              {filteredProduct.listPrice ? <p style={{ margin: 'unset', textDecoration: 'line-through', textAlign: 'center' }}>de: {(filteredProduct.listPrice/100).toLocaleString('pr-BR', {style: 'currency',currency: 'BRL', minimumFractionDigits: 2})}</p> : null }
                            </div>
                            <div style={{ height: '15%' }}>
                              <p style={{ margin: 'unset', color: 'black', fontSize: '1.5em', textAlign: 'center' }}><b>por {(filteredProduct.price/100).toLocaleString('pr-BR', {style: 'currency',currency: 'BRL', minimumFractionDigits: 2})}</b></p>
                            </div>
                            <div style={{ height: '15%' }}>
                              {filteredProduct.installments[0] ? <p style={{ margin: 'unset', textAlign: 'center' }}>ou em {filteredProduct.installments[0].quantity}x de {(filteredProduct.installments[0].value/100).toLocaleString('pr-BR', {style: 'currency',currency: 'BRL', minimumFractionDigits: 2})}</p> :null}
                            </div>
                            <div style={{ height: '40%' }}>
                              <div className="d-flex justify-content-center align-self-end"><button className="purchase-button"onClick={() => addProduct(filteredProduct.productId)}>COMPRAR</button></div>
                            </div>
                          </div>
                        } />
                    </Card>
                  )

                })
              }
            </div>
          </div>)
        array.push(obj);
      }

    }
    return array;
  }

  const listProductsInMobile = () => {
    let array = [];

    for (let index = 0; index < products.length; index++) {
      if (index == 0) {
        let obj = (
          <div class="carousel-item active">
            <div className="d-flex justify-content-center">
              {
                products.map((product, i) => {
                  if (i < 1) {
                    return (
                      <Card hoverable style={{ width: 240, height: '500px' }} cover={<Image width={'100%'} src={product.imageUrl} />}>
                        <Meta title={product.productName} description={
                          <div style={{ height: '100%' }}>
                            <div className="d-flex justify-content-center" style={{ height: '15%' }}>
                              <Rate allowHalf defaultValue={product.stars} disabled={true} style={{ color: '#F8475F' }}/>
                            </div>
                            <div style={{ height: '15%' }}>
                              {product.listPrice ? <p className="list-price">de: {(product.listPrice/100).toLocaleString('pr-BR', {style: 'currency',currency: 'BRL', minimumFractionDigits: 2})}</p> : null }
                            </div>
                            <div style={{ height: '15%' }}>
                              <p className="price"><b>por {(product.price/100).toLocaleString('pr-BR', {style: 'currency',currency: 'BRL', minimumFractionDigits: 2})}</b></p>
                            </div>
                            <div style={{ height: '15%' }}>
                              {product.installments[0] ? <p className="installment">ou em {product.installments[0].quantity}x de {(product.installments[0].value/100).toLocaleString('pr-BR', {style: 'currency',currency: 'BRL', minimumFractionDigits: 2})}</p> :null}
                            </div>
                            <div style={{ height: '40%' }}>
                              <div className="d-flex justify-content-center align-self-end">
                                <button className="purchase-button" onClick={() => addProduct(product.productId)}>COMPRAR</button>
                              </div>
                            </div>
                          </div>
                        } />
                      </Card>
                    )
                  }
                  i++;
                })
              }
            </div>
          </div>)
        array.push(obj);
      }
      if (index > 0) {

        let obj = (
          <div class="carousel-item">
            <div className="d-flex justify-content-center">
              {
                products.filter((product, i) => i >= index * 1 && i < (index + 1) * 1).map(filteredProduct => {
                  return (
                    <Card hoverable style={{ width: 240, height: '500px' }} cover={<Image width={'100%'} src={filteredProduct.imageUrl} />}>
                      <Meta title={filteredProduct.productName} description={
                          <div style={{ height: '100%' }}>
                            <div className="d-flex justify-content-center" style={{ height: '15%' }}>
                              <Rate allowHalf defaultValue={filteredProduct.stars} disabled={true} style={{ color: '#F8475F' }}/>
                            </div>
                            <div style={{ height: '15%' }}>
                              {filteredProduct.listPrice ? <p style={{ margin: 'unset', textDecoration: 'line-through', textAlign: 'center' }}>de: {(filteredProduct.listPrice/100).toLocaleString('pr-BR', {style: 'currency',currency: 'BRL', minimumFractionDigits: 2})}</p> : null }
                            </div>
                            <div style={{ height: '15%' }}>
                              <p style={{ margin: 'unset', color: 'black', fontSize: '1.5em', textAlign: 'center' }}><b>por {(filteredProduct.price/100).toLocaleString('pr-BR', {style: 'currency',currency: 'BRL', minimumFractionDigits: 2})}</b></p>
                            </div>
                            <div style={{ height: '15%' }}>
                              {filteredProduct.installments[0] ? <p style={{ margin: 'unset', textAlign: 'center' }}>ou em {filteredProduct.installments[0].quantity}x de {(filteredProduct.installments[0].value/100).toLocaleString('pr-BR', {style: 'currency',currency: 'BRL', minimumFractionDigits: 2})}</p> :null}
                            </div>
                            <div style={{ height: '40%' }}>
                              <div className="d-flex justify-content-center align-self-end"><button className="purchase-button"onClick={() => addProduct(filteredProduct.productId)}>COMPRAR</button></div>
                            </div>
                          </div>
                        } />
                    </Card>
                  )

                })
              }
            </div>
          </div>)
        array.push(obj);
      }

    }
    return array;
  }

  const listCarouselIndicator = () => {
    let obj = (
      <ol class="carousel-indicators">
        {
        products.map((product, i) => {
          if(i < 1){
            return(
              <li data-target="#carouselExampleIndicators4" data-slide-to={i} class="active"></li>
            )
          }
          else {
            return(
              <li data-target="#carouselExampleIndicators4" data-slide-to={i}></li>
            )
          }
        })
        }
      </ol>
    );
    return obj;
  }

  const openNotificationSucess = (message, description) => {
    notification.open({
      message: message,
      description: description,
      icon: <CheckCircleOutlined style={{ color: 'green' }} />,
    });
  };

  const openNotificationError = (message) => {
    notification.open({
      message: 'Algo deu errado!',
      description: message,
      icon: <AlertOutlined style={{ color: 'red' }} />,
    });
  };

  return (
    <Spin spinning={loading}>
      <div id="carouselExampleIndicators" class="carousel slide hidden-mobile" data-ride="carousel">
        <ol class="carousel-indicators">
          <li data-target="#carouselExampleIndicators" data-slide-to="0" class="active"></li>
          <li data-target="#carouselExampleIndicators" data-slide-to="1"></li>
          <li data-target="#carouselExampleIndicators" data-slide-to="2"></li>
          <li data-target="#carouselExampleIndicators" data-slide-to="3"></li>
        </ol>
        <div class="carousel-inner">
          <div class="carousel-item active">
            <img class="d-block w-100" src={banner} alt="First slide" />
          </div>
          <div class="carousel-item">
            <img class="d-block w-100" src={banner} alt="Second slide" />
          </div>
          <div class="carousel-item">
            <img class="d-block w-100" src={banner} alt="Third slide" />
          </div>
          <div class="carousel-item">
            <img class="d-block w-100" src={banner} alt="Four slide" />
          </div>
        </div>
      </div>

      <div id="carouselExampleIndicators3" class="carousel slide show-mobile" data-ride="carousel">
        <ol class="carousel-indicators">
          <li data-target="#carouselExampleIndicators3" data-slide-to="0" class="active"></li>
          <li data-target="#carouselExampleIndicators3" data-slide-to="1"></li>
          <li data-target="#carouselExampleIndicators3" data-slide-to="2"></li>
          <li data-target="#carouselExampleIndicators3" data-slide-to="3"></li>
        </ol>
        <div class="carousel-inner">
          <div class="carousel-item active">
            <img class="d-block w-100" src={banner_mobile} alt="First slide" />
          </div>
          <div class="carousel-item">
            <img class="d-block w-100" src={banner_mobile} alt="Second slide" />
          </div>
          <div class="carousel-item">
            <img class="d-block w-100" src={banner_mobile} alt="Third slide" />
          </div>
          <div class="carousel-item">
            <img class="d-block w-100" src={banner_mobile} alt="Four slide" />
          </div>
        </div>
      </div>

      <div className="home container">
        <div class="d-flex flex-column bd-highlight spacing-products">
          <div class="bd-highlight p-2">
            <h4 className="title">Mais Vendidos</h4>
            <hr className="trace" />
          </div>
          <div class="bd-highlight">

            <div id="carouselExampleIndicators2" class="hidden-mobile-home carousel slide d-flex justify-content-center" data-ride="carousel">
              <div class="carousel-inner" style={{ width: '90%' }}>
                {listProducts()}
              </div>
              <a class="carousel-control-prev" href="#carouselExampleIndicators2" role="button" data-slide="prev" style={{ width: '5%' }}>
                <span class="carousel-control-prev-icon" aria-hidden="true"></span>
                <span class="sr-only">Previous</span>
              </a>
              <a class="carousel-control-next" href="#carouselExampleIndicators2" role="button" data-slide="next" style={{ width: '5%' }}>
                <span class="carousel-control-next-icon" aria-hidden="true"></span>
                <span class="sr-only">Next</span>
              </a>
            </div>

            <div id="carouselExampleIndicators4" class="show-mobile-home carousel slide d-flex justify-content-center" data-ride="carousel">
                {listCarouselIndicator()}
              <div class="carousel-inner" style={{ width: '100%' }}>
                {listProductsInMobile()}
              </div>
            </div>

          </div>
        </div>
      </div>

      <div className="newsletter">
        <div className="container">
          <div class="d-flex flex-column bd-highlight" style={{ width: '100%' }}>
            <div class="bd-highlight d-flex justify-content-center">
              <h4 className="title">Participe de nossas news com promoções e novidades!</h4>
            </div>
            <div class="bd-highlight d-flex justify-content-center">
              <Form onFinish={(form) => submitNewsletter(form)} layout={'inline'} style={{ width: '100%' }} className="d-flex justify-content-center">
                <div className="input-size-newsletter">
                  <Form.Item name='name' rules={[{ required: true, message: 'Porfavor insira seu nome!' }]}>
                    <Input placeholder="Digite seu nome" style={{ height: '100%' }}/>
                  </Form.Item>
                </div>
                <div className="input-size-newsletter">
                  <Form.Item name='email' rules={[{ required: true, type: "email", message: 'Porfavor insira um email válido!' }]}>
                    <Input placeholder="Digite seu email" style={{ height: '100%' }}/>
                  </Form.Item>
                </div>
                <div className="button-size-newsletter">
                  <Form.Item>
                    <button className="newsletter-button" htmlType="submit">Eu quero!</button>
                  </Form.Item>
                </div>
              </Form>
            </div>
          </div>
        </div>
      </div>
    </Spin>
  )
}

export default Home;