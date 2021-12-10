import "../App.css";
import * as React from "react";
import { useState, useEffect } from "react";
import { makeStyles } from "@material-ui/core/styles";
import {
  Grid,
  Card,
  CardContent,
  Typography,
  CardMedia,
  CardActions,
  Button,
  Box,
  TextField,
} from "@material-ui/core/";
import { useNavigate } from "react-router-dom";
import { LoginContext } from "../Context/LoginContext";
import { useContext } from "react";

const useStyles = makeStyles((theme) => ({
  root: {
    flexGrow: 1,
    padding: theme.spacing(2),
  },
}));

const Products = () => {
  const classes = useStyles();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [value, setValue] = useState("");
  const navigate = useNavigate();
  // const [setUsername, setPassword, username] = useContext(LoginContext);

  const handleLogout = () => {
    localStorage.clear();
    navigate("/");
  };
  const btnstyle = {
    margin: "10px 0",
    backgroundColor: "darkred",
    marginRight: "40px",
  };

  React.useEffect(() => {
    fetch("http://localhost:8082/ProductInfo/1")
      .then((response) => {
        if (!response.ok) {
          throw Error("could not fetch data for that resource");
        }
        return response.json();
      })
      .then((data) => {
        console.log(data);
        setTimeout(() => {
          setProducts(data);
          setLoading(false);
        }, 1000);
        setError(null);
      })
      .catch((err) => {
        setError(err.message);
        console.log(err);
        setLoading(false);
        setProducts([]);
      });
  }, []);

  useEffect(() => {
    setFilteredProducts(
      products.filter((product) =>
        product.productname.toLowerCase().includes(value.toLowerCase())
      )
    );
  }, [value, products]);
  return (
    <React.Fragment>
      <Grid
        spacing={3}
        container
        direction="row"
        justify="flex-end"
        alignItems="flex-end"
      >
        <Grid item xs={1}>
          <Button
            type="submit"
            color="primary"
            variant="contained"
            fullWidth
            onClick={handleLogout}
            style={btnstyle}
          >
            Logout
          </Button>
        </Grid>
      </Grid>
      <Box
        sx={{
          width: 800,
          maxWidth: "100%",
        }}
      >
        <TextField
          value={value}
          onChange={(e) => setValue(e.target.value)}
          style={{ color: "red" }}
          size="large"
          id="outlined-basic"
          label="Search By Product Name"
          variant="outlined"
          style={{ width: "50%" }}
        />
      </Box>
      {error && (
        <Typography variant="h4" align="center" style={{ marginTop: "40px" }}>
          {error}
        </Typography>
      )}
      {loading && (
        <Typography variant="h4" align="center" style={{ marginTop: "40px" }}>
          Fetching Products...
        </Typography>
      )}
      <Grid
        container
        spacing={4}
        direction="row"
        justify="flex-start"
        alignItems="flex-start"
        style={{ marginLeft: "2px", marginTop: "80px" }}
      >
        {/* data mapping will happen here */}
        {filteredProducts.map((product, index) => (
          <Grid item xs={2}>
            <Card key={index}>
              <CardMedia image={product.imageurl} style={{ height: "240px" }} />
              <CardContent>
                <Typography align="left" variant="h6" gutterBottom>
                  Price: $ {product.price}
                </Typography>
                <Typography align="left" variant="h6" gutterBottom>
                  ProductName:{product.productname}
                </Typography>
                <Typography align="left" variant="h6" gutterBottom>
                  Quantity: {product.quantity}
                </Typography>
              </CardContent>
              <CardActions>
                <Button
                  style={{ backgroundColor: "darkred", color: "white" }}
                  variant="contained"
                  size="small"
                  onClick={() => {
                    navigate(`/ProductDetails/${product.productid}`, {
                      state: {
                        productid: product.productid,
                        productname: product.productname,
                        productimage: product.imageurl,
                        productquantity: product.quantity,
                        productprice: product.price,
                      },
                    });
                  }}
                >
                  Buy Now
                </Button>
              </CardActions>
            </Card>
          </Grid>
        ))}
      </Grid>
    </React.Fragment>
  );
};

export default Products;
