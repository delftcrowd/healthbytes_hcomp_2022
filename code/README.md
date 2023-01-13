# HealthBytes - Gesture Inputs for Crowdsourced Microtasks

[comment]: <> (TODO Add the DOI once we have it.)

This is the front-end repository for the web application used in the 2022 Human Computation Conference
paper [*"Gesticulate for Health's Sake! Understanding the Trade-offs of Gestures as an Input Modality for Microtask 
Crowdsourcing"*]().

## Usage Instructions

### Configuration

Go to [src/constants/AppContants.tsx](src/constants/AppConstants.tsx) and update `SERVER_URL` variable with the server address or set an environment variable named `REACT_APP_SERVER_URL`.
### Start dev server
```
yarn start:dev
```

## Server Code

[comment]: <> (Use public repo link here once it is uploaded.)
The server-side implementation for this web application can be found in the [healthbytes-server repository]().


## Further Information and Citation

[comment]: <> (Add DOI link here as well. Second link is for the OSF webpage.)

If you wish to read the paper in full, you can find it [here](). You can also find more information about the project, 
including the surveys used, on the Open Science Framework website, []().

If you use any portion of this repository in your academic work, please include the following citation.

[comment]: <> (TODO: Update the below citation once we figure out what source it is: proceeding, misc, or article)

```
@article{allen2022gesticulate,
  title={Gesticulate for Health's Sake! Understanding the Trade-offs of Gestures as an Input Modality for Microtask Crowdsourcing},
  author={Allen, Garrett and Hu, Andrea and Gadiraju, Ujwal},
  journal={Proceedings of HCOMP},
  year={2022}
}
```

## License

This project is licensed under the terms of the [Apache-2.0 license](LICENSE.txt).