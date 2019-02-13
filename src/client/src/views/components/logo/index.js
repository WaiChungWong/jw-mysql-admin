import React from "react";

import "./style.css";

const LOGO_PATH = `
  M213.845 84.808 C 204.815 86.328,199.498 88.250,185.198 95.164 L 177.734 98.771 152.344 98.830 C 109.048 98.930,92.511 103.041,67.087 120.021 C 52.320 129.884,30.085 157.241,27.785 168.378 C 27.517 169.677,25.201 173.164,22.638 176.128 C 9.674 191.121,12.548 198.839,28.174 190.991 C 39.494 185.306,42.173 184.865,61.719 185.469 C 80.444 186.048,84.380 185.615,94.131 181.901 C 102.812 178.595,104.984 178.933,119.343 185.821 C 142.519 196.940,153.108 199.178,169.922 196.514 C 192.912 192.872,195.066 191.521,183.594 187.940 C 170.613 183.888,155.664 177.372,152.031 174.182 C 146.934 169.707,149.855 169.225,165.890 171.893 C 191.073 176.084,200.301 178.409,216.406 184.623 C 247.136 196.480,272.112 215.894,297.737 247.841 C 313.906 267.999,312.972 265.902,310.426 276.319 C 307.756 287.245,307.647 296.330,310.083 304.898 C 313.258 316.066,315.592 318.096,318.601 312.305 C 319.550 310.479,321.917 306.747,323.862 304.012 C 325.807 301.277,327.804 297.521,328.300 295.666 C 329.087 292.724,329.388 292.391,330.651 293.066 C 334.432 295.090,344.200 296.221,361.468 296.635 C 386.183 297.228,389.033 296.492,381.661 291.420 C 379.739 290.098,374.740 286.168,370.553 282.687 C 353.965 268.900,347.967 265.454,333.491 261.399 C 326.563 259.458,326.154 258.861,323.005 246.094 C 320.507 235.967,315.969 220.115,314.059 214.844 C 300.380 177.092,282.848 152.408,254.963 131.641 C 235.281 116.982,234.013 106.825,250.947 99.467 C 258.600 96.142,264.063 92.400,264.063 90.483 C 264.063 85.403,231.896 81.768,213.845 84.808
`;

const Logo = props => (
  <svg {...props} xmlns="http://www.w3.org/2000/svg" viewBox="0 50 400 300">
    <path d={LOGO_PATH} stroke="none" fill="#000000" />
  </svg>
);

export default Logo;
