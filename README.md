# HealthBytes - Gesture Inputs for Crowdsourced Microtasks

# Introduction
This is the client side repository for the web application used in the 2022 Human Computation Conference paper [*"Gesticulate for Health's Sake! Understanding the Trade-offs of Gestures as an Input Modality for Microtask Crowdsourcing"*](https://doi.org/10.1609/hcomp.v10i1.21984).

# Research Summary
Human input is pivotal in building reliable and robust artificial intelligence systems. By providing a means to gather diverse, high-quality, representative, and cost-effective human input on demand, microtask crowdsourcing marketplaces have thrived. Despite the unmistakable benefits available from online crowd work, the lack of health provisions and safeguards, along with existing work practices threatens the sustainability of this paradigm. Prior work has investigated worker engagement and mental health, yet no such investigations into the effects of crowd work on the physical health of workers have been undertaken. Crowd workers complete their work in various sub-optimal work environments, often using a conventional input modality of a mouse and keyboard. The repetitive nature of microtask crowdsourcing can lead to stress-related injuries, such as the well-documented carpal tunnel syndrome. It is known that stretching exercises can help reduce injuries and discomfort in office workers. *Gestures*, the act of using the body intentionally to affect the behavior of an intelligent system, can serve as both stretches and an alternative form of input for microtasks. To better understand the usefulness of the dual-purpose input modality of ergonomically-informed gestures across different crowdsourced microtasks, we carried out a controlled 2 x 3 between-subjects study (*N=294*). Considering the potential benefits of gestures as an input modality, our results suggest a real trade-off between worker accuracy in exchange for potential short to long-term health benefits.

If you wish to read the paper in full, you can find it [here](https://doi.org/10.1609/hcomp.v10i1.21984).

# Keywords
Crowdsourcing, Input Modality, Microtasks, Ergonomics, Worker Health

# Data
The data collected during this project, and the surveys used, can be found on the Open Science Framework [here](https://osf.io/7x526/).

# Dependencies

This project uses ```yarn``` to handle package installations. The version dependencies are tracked in the [package.json file](https://github.com/delftcrowd/healthbytes_hcomp_2022/tree/main/code/src/package.json).

# Installation & Usage

To install all the package dependencies, navigate to the top level directory of the project (```/healthbytes_hcomp_2022```) and use the following command:

```
yarn install
```

### Start dev server

To start the developement server to get a live look at the project, run the following command:

```
yarn start:dev
```

## Front End Code

[comment]: <> (Use public repo link here once it is uploaded.)
The server side implementation for this web application can be found in the [healthbytes_server_hcomp_2022 repository](https://github.com/delftcrowd/healthbytes_server_hcomp_2022).

# Citation

If you use any portion of this repository in your academic work, please include the following citation.

```
@inproceedings{allen2022gesticulate,
  title={Gesticulate for Health’s Sake! Understanding the Use of Gestures as an Input Modality for Microtask Crowdsourcing},
  author={Allen, Garrett and Hu, Andrea and Gadiraju, Ujwal},
  booktitle={Proceedings of the AAAI Conference on Human Computation and Crowdsourcing},
  volume={10},
  number={1},
  pages={14--26},
  year={2022}
}
```

# License
This project is licensed under the terms of the [Apache-2.0 license](LICENSE).